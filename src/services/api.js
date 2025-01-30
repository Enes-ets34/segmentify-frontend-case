import Question from "../models/Question.js";
import Product from "../models/Product.js";

const API_ENDPOINTS = {
  questions: `/src/data/questions.json`,
  products: `/src/data/products.json`,
};
class ApiService {
  static async fetchQuestions() {
    try {
      const response = await fetch(API_ENDPOINTS.questions);
      
      if (!response.ok) {
        throw new Error(`Sorular yüklenemedi: HTTP ${response.status}`);
      }
      
      const data = await response.json();

      const questions = data.steps || (data[0] && data[0].steps);

      if (!questions) {
        throw new Error("Soru verisi bulunamadı veya yanlış formatta");
      }

      if (!Array.isArray(questions)) {
        throw new Error("Soru verisi dizi formatında değil");
      }

      return questions.map(q => new Question(
        q.step,
        q.type,
        q.subtype,
        q.title,
        q.subtitle,
        q.answers
      ));
    } catch (error) {
      throw error;
    }
  }

  static async fetchProducts() {
    try {
      const response = await fetch(API_ENDPOINTS.products);
      
      if (!response.ok) {
        throw new Error(`Ürünler yüklenemedi: HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Ürün verisi dizi formatında değil");
      }

      return data.map(p => new Product(p));
    } catch (error) {
      throw error;
    }
  }
}

export default ApiService;
