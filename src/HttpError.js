export class HttpError extends Error {

  constructor(statusCode, json) {
    const message = json?.message || JSON.stringify(json);
    super(message);

    this.name = "HttpError";
    this.statusCode = statusCode;
    this.body = json; // This will ALWAYS be a JSON object
  }

  static async fromResponse(response) {
    let json;
    const text = await response.text();

    try {
      const parsed = JSON.parse(text);

      if (parsed && typeof parsed === 'object') {
        json = parsed;
      } else {
        json = { message: parsed };
      }
    } catch (e) {
      json = { message: text || response.statusText };
    }

    return new HttpError(response.status, json);
  }

}