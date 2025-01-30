import { QuestionType } from '../constants/types.js';

class Question {
    constructor(step, type, subtype, title, subtitle = '', answers = []) {
        this.step = step;
        this.type = type;
        this.subtype = subtype;
        this.title = title;
        this.subtitle = subtitle;
        this.answers = answers;
        this.validate();
    }

    validate() {
        if (!Object.values(QuestionType).includes(this.type)) {
            throw new Error(`Geçersiz soru tipi: ${this.type}`);
        }
    }

    isCategoryType() {
        return this.type === QuestionType.CATEGORY;
    }

    isColorType() {
        return this.type === QuestionType.COLOR;
    }

    isPriceType() {
        return this.type === QuestionType.PRICE;
    }
}

export default Question; 