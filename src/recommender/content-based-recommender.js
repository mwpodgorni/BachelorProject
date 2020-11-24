const Vector = require("vector-object");
const striptags = require("striptags");
const sw = require("stopword");
const natural = require("natural");

const { TfIdf, PorterStemmer } = natural;
const tokenizer = new natural.WordTokenizer();

const defaultOptions = {
  maxVectorSize: 100,
  maxSimilarDocuments: Number.MAX_SAFE_INTEGER,
  minScore: 0,
};

class ContentBasedRecommender {
  constructor() {
    this.options = Object.assign({}, defaultOptions);
    this.data = {};
  }
  train(documents) {
    const preprocessDocs = this.preprocessDocuments(documents, this.options);
    const docVectors = this.produceWordVectors(preprocessDocs, this.options);
    this.data = this.calculateSimilarities(docVectors, this.options);
  }
  preprocessDocuments(documents) {
    const processedDocuments = documents.map((item) => {
      let tokens = this.getTokensFromString(item.content);
      return { id: item.id, tokens };
    });
    return processedDocuments;
  }
  getTokensFromString(string) {
    const tmpString = striptags(string, [], "").toLowerCase();
    const tokens = tokenizer.tokenize(tmpString);
    const unigrams = sw.removeStopwords(tokens).map((unigram) => PorterStemmer.stem(unigram));
    return unigrams;
  }
  produceWordVectors(processedDocuments, options) {
    const tfidf = new TfIdf();
    processedDocuments.forEach((processedDocument) => {
      tfidf.addDocument(processedDocument.tokens);
    });
    const documentVectors = [];
    for (let i = 0; i < processedDocuments.length; i++) {
      const processedDocument = processedDocuments[i];
      const hash = {};
      const items = tfidf.listTerms(i);
      const maxSize = Math.min(options.maxVectorSize, items.length);
      for (let j = 0; j < maxSize; j++) {
        const item = items[j];
        hash[item.term] = item.tfidf;
      }
      const documentVector = {
        id: processedDocument.id,
        vector: new Vector(hash),
      };
      documentVectors.push(documentVector);
    }
    return documentVectors;
  }
  calculateSimilarities(documentVectors, options) {
    const data = { ...this.initializeDataHash(documentVectors) };

    for (let i = 0; i < documentVectors.length; i++) {
      for (let j = 0; j < i; j++) {
        let documentVectorA = documentVectors[i];
        const idi = documentVectorA.id;
        const vi = documentVectorA.vector;
        let documentVectorB = documentVectors[j];
        const idj = documentVectorB.id;
        const vj = documentVectorB.vector;
        const similarity = vi.getCosineSimilarity(vj);

        if (similarity > options.minScore) {
          data[idi].push({
            id: documentVectorB.id,
            score: similarity,
          });
          data[idj].push({
            id: documentVectorA.id,
            score: similarity,
          });
        }
      }
    }
    this.orderDocuments(data, options);
    return data;
  }
  orderDocuments(data, options) {
    Object.keys(data).forEach((id) => {
      data[id].sort((a, b) => b.score - a.score);
      if (data[id].length > options.maxSimilarDocuments) {
        data[id] = data[id].slice(0, options.maxSimilarDocuments);
      }
    });
  }
  initializeDataHash(documentVectors) {
    return documentVectors.reduce((acc, item) => {
      acc[item.id] = [];
      return acc;
    }, {});
  }
  getSimilarDocuments(id, start = 0, size = undefined) {
    let similarDocuments = this.data[id];
    if (similarDocuments === undefined) {
      return [];
    }
    const end = size !== undefined ? start + size : undefined;
    similarDocuments = similarDocuments.slice(start, end);
    return similarDocuments;
  }
}

module.exports = ContentBasedRecommender;
