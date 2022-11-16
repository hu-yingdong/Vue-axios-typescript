import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import qs from 'qs'

class Request {
  protected baseURL: any = "http://localhost:8080/api"
  protected axiosObj: any = axios
  protected axiosRequestConfig: AxiosRequestConfig = {}
  protected successCode: Array<Number> = [200, 201, 204]
  private static _instance: Request;

  // 构造方法
  constructor() {
    this.requestConfig()
    this.axiosObj = axios.create(this.axiosRequestConfig)
    this.interceptorsRequest()
    this.interceptorsResponse()
  }

  // 单例模式
  public static getInstance() : Request {
    // 如果 instance 是一个实例 直接返回，  如果不是 实例化后返回
    this._instance || (this._instance = new Request())
    return this._instance
  }

  // 配置
  protected requestConfig(): void {
    this.axiosRequestConfig = {
      baseURL: this.baseURL,
      headers: {
        timestamp: new Date().getTime(),
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      transformRequest: [function (data){
        return qs.stringify(data)
      }],
      transformResponse: [function(data: AxiosResponse) {
        return data
      }],

      timeout: 30000,
      withCredentials: false,
      responseType: 'json',
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      maxRedirects: 5,
      maxContentLength: 2000,
      validateStatus: function(status: number) {
        return status >= 200 && status < 500
      }
    }
  }

  // Resquest拦截器
  protected interceptorsRequest() {
    this.axiosObj.interceptors.request.use(
      (config: any) => {
        this.requestLog(config)
        return config
      },
      (error: any) => {
        return Promise.reject(error)
      }
    )
  }
 
  // Response拦截器
  protected interceptorsResponse(): void {
    this.axiosObj.interceptors.response.use(
      (response: any) => {
        this.responseLog(response)

        if (this.successCode.indexOf(response.status) === -1) {
          if (response.data.code === 401) {
            
          }
          return Promise.reject(new Error(response.message || 'Error'))
        } else {
          return response.data
        }
      },
      (error: any) => {
        return Promise.reject(error)
      }
    )
  }

  // Post
  public async post(url: string, data: any = {}, config: object = {}) {
    try {
      const result = await this.axiosObj.post(url, data, config)
      return result.data
    } catch (error) {
      console.error(error)
    }
  }

  // Delete
  public async delete(url: string, config: object = {}) {
    try {
      await this.axiosObj.delete(url, config)
    } catch (error) {
      console.error(error)
    }
  }

  // Put
  public async put(url: string, data: any = {}, config: object = {}) {
    try {
      await this.axiosObj.put(url, data, config)
    } catch (error) {
      console.error(error)
    }
  }

 // Get
 public async get(url: string, parmas: any = {}, config: object = {}) {
    try {
      await this.axiosObj.get(url, parmas, config)
    } catch (error) {
      console.error(error)
    }
  }
  
  protected requestLog(request: any): void {
    const randomColor = `rgba(${Math.round(Math.random() * 255)},${Math.round(
        Math.random() * 255
      )},${Math.round(Math.random() * 255)})`
      console.log(
        '%c┍------------------------------------------------------------------┑',
        `color:${randomColor};`
      )
      console.log('| 请求地址：', request.config.url)
      console.log(
        '%c┕------------------------------------------------------------------┙',
        `color:${randomColor};`
      )
  }

  protected responseLog(response: any): void {
      const randomColor = `rgba(${Math.round(Math.random() * 255)},${Math.round(
        Math.random() * 255
      )},${Math.round(Math.random() * 255)})`
      console.log(
        '%c┍------------------------------------------------------------------┑',
        `color:${randomColor};`
      )
      console.log('| 请求地址：', response.config.url)
      console.log('| 请求参数：', qs.parse(response.config.data))
      console.log('| 返回数据：', response.data)
      console.log(
        '%c┕------------------------------------------------------------------┙',
        `color:${randomColor};`
      )
  }
}

export default Request.getInstance()

