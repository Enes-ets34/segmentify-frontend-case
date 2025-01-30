import Question from "../models/Question.js";
import Product from "../models/Product.js";

const API_ENDPOINTS = {
  questions: "data/questions.json",
  products: "data/products.json",
};

class ApiService {
  static async fetchQuestions() {
    try {
      const response = await fetch(API_ENDPOINTS.questions);
      const data = await response.json();

      const questions = data[0].steps;

      if (!Array.isArray(questions)) {
        throw new Error("Soru verisi dizi formatında değil");
      }

      return questions.map(
        (q) =>
          new Question(
            q.step,
            q.type,
            q.subtype,
            q.title,
            q.subtitle,
            q.answers
          )
      );
    } catch (error) {
      console.error("Sorular yüklenirken hata oluştu:", error);
      return [];
    }
  }

  static async fetchProducts() {
    try {
      const response = await fetch(API_ENDPOINTS.products);
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Ürün verisi dizi formatında değil");
      }

      return data.map((p) => new Product(p));
    } catch (error) {
      console.error("Ürünler yüklenirken hata oluştu:", error);
      return [];
    }
  }
}

export default ApiService;
