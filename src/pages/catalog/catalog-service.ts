import type {RawAxiosRequestConfig} from "axios";
import {CatalogResponseSchema, DefaultApi} from "../../api-client";

type RequestParams = {
    maxResult?: number,
    page?: number,
    kindSearch?: number,
    startswith?: string | null,
    endswith?: string | null,
    contains?: string | null,
    article?: string | null,
    options?: RawAxiosRequestConfig
}
const api  = new DefaultApi()

export async function getCatalog(params:RequestParams){

    const query = {
        ...params,
        startswith:params.startswith||undefined,
        endswith:params.endswith||undefined,
        contains:params.contains||undefined,
        article:params.article||undefined,
        maxResult:25,
    }

    return await api.catalogApiApiCatalogGet(query).then((response)=>response.data)
}
export async function getDetails(id:number){
    return await api.getFullProductInfoApiProductInfoItemIdGet(id).then((response)=>response.data)
}
