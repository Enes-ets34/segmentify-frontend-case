import { QuestionType, ProductType, ColorMap } from "./src/constants/types.js";
import ApiService from "./src/services/api.js";

let questions = [];
let products = [];
let currentStep = 0;
let userAnswers = {};
let isLoading = false;

function createInitialStructure() {
  const structure = `
    <div class="container">
      <div class="quiz-container">
        <div class="question-container">
        <p id="question-subtitle"></p>
          <h2 id="question-title"></h2>
          <div id="answers-container"></div>
        </div>
        <div class="quiz-navigation">
          <div class="quiz-navigation-button">
            <button id="back-btn"  disabled>
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="quiz-navigation-button-label">Geri</span>
          </div>
          <div class="quiz-navigation-button">
            <button id="next-btn" disabled>
              <i class="fas fa-chevron-right"></i>
            </button>
            <span class="quiz-navigation-button-label">İleri</span>
          </div>
        </div>
        <div class="steps">
          ${Array(questions.length)
            .fill('<div class="step-indicator"></div>')
            .join("")}
        </div>
      </div>
      <div class="products-container" style="display: none;">
        <div class="products-slider"></div>
      </div>
    </div>
  `;

  $("#app").html(structure);
  bindEventListeners();
}

function bindEventListeners() {
  $("#next-btn").on("click", async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    const selectedElement = $(".answer-option.selected, .color-option.selected");
    if (selectedElement.length === 0) {
        $("#next-btn").prop("disabled", true);
        return;
    }

    const selectedValue = selectedElement.data("value");
    userAnswers[currentStep] = selectedValue;

    if (currentStep < questions.length - 1) {
        currentStep++;
        showQuestion(currentStep);
        updateNavigationButtons();
    } else {
        await renderProducts();
    }
  });

  $("#back-btn").on("click", (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    if (currentStep === 0) {
        $("#back-btn").prop("disabled", true);
        return;
    }

    currentStep--;
    showQuestion(currentStep);
    updateNavigationButtons();
  });

  $(document).on("click", ".answer-option, .color-option", function() {
    if (isLoading) return;

    const selectedValue = $(this).data("value");
    if (!selectedValue) {
        return;
    }

    const currentQuestion = questions[currentStep];

    if (currentQuestion.type === QuestionType.COLOR) {
        $(".color-option").removeClass("selected");
        $(".color-circle").css("border-color", "var(--border-color)");
        $(this).find(".color-circle").css("border-color", ColorMap[selectedValue]);
    } else {
        $(".answer-option").removeClass("selected");
    }

    $(this).addClass("selected");
    $("#next-btn").prop("disabled", false);
  });
}

async function loadData() {
  try {
    showLoading();
    [questions, products] = await Promise.all([
      ApiService.fetchQuestions(),
      ApiService.fetchProducts(),
    ]);

    if (!questions.length || !products.length) {
      throw new Error("Veriler yüklenemedi");
    }

    hideLoading();
    createInitialStructure();
    initializeQuiz();
  } catch (error) {
    hideLoading();
    $("#app").html(`
      <div class="container">
        <div class="error-message">
          <h2>Bir hata oluştu</h2>
          <p>Veriler yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.</p>
        </div>
      </div>
    `);
  }
}

function initializeQuiz() {
  showQuestion(currentStep);
  updateNavigationButtons();
}

function showQuestion(step) {
  if (!questions[step]) {
    return;
  }

  const currentQuestion = questions[step];
  $("#question-title").text(currentQuestion.title);
  $("#question-subtitle").text(currentQuestion.subtitle || "");

  if (currentQuestion.type === QuestionType.PRICE) {
    $("#answers-container").addClass('price-grid');
  } else {
    $("#answers-container").removeClass('price-grid');
    $("#answers-container").css(
      "flex-direction",
      currentQuestion.type === QuestionType.CATEGORY ? "column" : "row"
    );
  }

  const answersHtml = currentQuestion.answers
    .map((answer) => {
      const isSelected = userAnswers[step] === answer;

      if (currentQuestion.type === QuestionType.COLOR) {
        return `
                  <div class="color-option ${isSelected ? "selected" : ""}" 
                       data-value="${answer}">
                      <span class="color-circle" 
                            style="background-color: ${ColorMap[answer]}; 
                                   ${
                                     isSelected
                                       ? `border-color: ${ColorMap[answer]}`
                                       : ""
                                   }">
                      </span>
                  </div>
              `;
      }

      return `
              <div class="answer-option btn-primary ${
                isSelected ? "selected" : ""
              }" 
                   data-value="${answer}">
                  ${answer}
              </div>
          `;
    })
    .join("");

  $("#answers-container").html(answersHtml);

  if (currentQuestion.type === QuestionType.COLOR) {
    $(".color-option.selected").each(function () {
      const selectedColor = $(this).data("value");
      $(this)
        .find(".color-circle")
        .css("border-color", ColorMap[selectedColor]);
    });
  }

  updateStepIndicators(step);
  updateNavigationButtons();
}

function updateStepIndicators(currentStep) {
  $(".step-indicator").removeClass("active");
  $(".step-indicator").eq(currentStep).addClass("active");
}

function updateNavigationButtons() {
  const hasSelection = userAnswers[currentStep] !== undefined;
  $("#next-btn").prop("disabled", !hasSelection);

  $("#back-btn").prop("disabled", currentStep === 0);
}

function filterProducts() {
  return products.filter((product) => {
    const categoryMatch =
      !userAnswers[0] || product.hasCategory(userAnswers[0]);

    const selectedColor = userAnswers[1];
    const colorMatch = !selectedColor || product.hasColor(selectedColor);

    if (userAnswers[2]) {
      const [min, max] = userAnswers[2].split("-");
      const priceMatch = product.isInPriceRange(min, max);
      return categoryMatch && colorMatch && priceMatch;
    }

    return categoryMatch && colorMatch;
  });
}

function showLoading() {
  isLoading = true;
  $("#answers-container").html(`
    <div class="loading">
      Loading...
    </div>
  `);
}

function hideLoading() {
  isLoading = false;
  $("#answers-container").html("");
}

async function renderProducts() {
  const filteredProducts = filterProducts();

  if (filteredProducts.length === 0) {
    return showNoProductsMessage();
  }

  showLoading();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  hideLoading();
  $(".quiz-container").hide();
  $(".products-container").show();
  $(".steps").hide();

  const productsHtml = filteredProducts
    .map(
      (product) => `
        <div class="product-card">
            <img class="product-image" data-lazy="${product.image}" alt="${
        product.name
      }">
            <div class="product-card-description">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price-container">
                    ${
                      product.type === ProductType.DISCOUNTED
                        ? `<span class="product-old-price">${product.oldPriceText}</span>
                           <span class="product-price product-discounted">${product.priceText}</span>`
                        : `<span class="product-price">${product.priceText}</span>`
                    }
                </div>
                <a href="#" class="btn-dark" role="button">Ürünü Görüntüle</a>
            </div>
        </div>
    `
    )
    .join("");

  $(".products-slider").html(productsHtml);

  $(".products-slider").slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: "ondemand",
    arrows: true,
    accessibility: true,
    focusOnSelect: false,
    focusOnChange: false,
  });

  $(".product-card").removeAttr("tabindex");
  $(".slick-slide").removeAttr("role");
  $(".slick-slide").removeAttr("aria-hidden");
}

function showNoProductsMessage() {
  $("#answers-container").html(`
    <div class="no-products">
      <h3>Ürün Bulunamadı</h3>
      <p>Farklı filtreler deneyebilirsiniz.</p>
    </div>
  `);
  $("#next-btn").prop("disabled", true);
  $(".products-container").hide();
  $(".steps").show();
}

$(document).ready(() => {
  loadData();
});
