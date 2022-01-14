/* tslint:disable */
/* eslint-disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.15.5.0 (NJsonSchema v10.6.6.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
// ReSharper disable InconsistentNaming

export class ProtobufClient {
  private http: {
    fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
  };
  private baseUrl: string;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined =
    undefined;

  constructor(
    baseUrl?: string,
    http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }
  ) {
    this.http = http ? http : <any>window;
    this.baseUrl =
      baseUrl !== undefined && baseUrl !== null
        ? baseUrl
        : "https://localhost:7076";
  }

  getAvailableRaids(): Promise<string> {
    let url_ = this.baseUrl + "/v1/protobuf";
    url_ = url_.replace(/[?&]$/, "");

    let options_ = <RequestInit>{
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    return this.http.fetch(url_, options_).then((_response: Response) => {
      return this.processGetAvailableRaids(_response);
    });
  }

  protected processGetAvailableRaids(response: Response): Promise<string> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach((v: any, k: any) => (_headers[k] = v));
    }
    if (status === 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        let resultData200 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result200 = resultData200 !== undefined ? resultData200 : <any>null;

        return result200;
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error occurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve<string>(<any>null);
  }
}

export class RaidsClient {
  private http: {
    fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
  };
  private baseUrl: string;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined =
    undefined;

  constructor(
    baseUrl?: string,
    http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }
  ) {
    this.http = http ? http : <any>window;
    this.baseUrl =
      baseUrl !== undefined && baseUrl !== null
        ? baseUrl
        : "https://localhost:7076";
  }

  getAvailableRaids(): Promise<Raid[]> {
    let url_ = this.baseUrl + "/v1/available-raids";
    url_ = url_.replace(/[?&]$/, "");

    let options_ = <RequestInit>{
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    return this.http.fetch(url_, options_).then((_response: Response) => {
      return this.processGetAvailableRaids(_response);
    });
  }

  protected processGetAvailableRaids(response: Response): Promise<Raid[]> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach((v: any, k: any) => (_headers[k] = v));
    }
    if (status === 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        let resultData200 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        if (Array.isArray(resultData200)) {
          result200 = [] as any;
          for (let item of resultData200) result200!.push(Raid.fromJS(item));
        } else {
          result200 = <any>null;
        }
        return result200;
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error occurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve<Raid[]>(<any>null);
  }
}

export class Raid implements IRaid {
  id!: number;
  englishName!: string;
  japaneseName!: string;
  category!: string;
  element!: string;

  constructor(data?: IRaid) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.id = _data["id"];
      this.englishName = _data["englishName"];
      this.japaneseName = _data["japaneseName"];
      this.category = _data["category"];
      this.element = _data["element"];
    }
  }

  static fromJS(data: any): Raid {
    data = typeof data === "object" ? data : {};
    let result = new Raid();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["id"] = this.id;
    data["englishName"] = this.englishName;
    data["japaneseName"] = this.japaneseName;
    data["category"] = this.category;
    data["element"] = this.element;
    return data;
  }
}

export interface IRaid {
  id: number;
  englishName: string;
  japaneseName: string;
  category: string;
  element: string;
}

export class ApiException extends Error {
  message: string;
  status: number;
  response: string;
  headers: { [key: string]: any };
  result: any;

  constructor(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result: any
  ) {
    super();

    this.message = message;
    this.status = status;
    this.response = response;
    this.headers = headers;
    this.result = result;
  }

  protected isApiException = true;

  static isApiException(obj: any): obj is ApiException {
    return obj.isApiException === true;
  }
}

function throwException(
  message: string,
  status: number,
  response: string,
  headers: { [key: string]: any },
  result?: any
): any {
  if (result !== null && result !== undefined) throw result;
  else throw new ApiException(message, status, response, headers, null);
}
