import {demoRequest, uploadRequest} from '../request';

/** get line list */
export function getLines(params: Api.Manufacture.lineSearchParams) {
  return demoRequest<Api.Manufacture.LineList>({
    url: '/line/selectLine',
    method: 'post',
    data: params
  });
}

export function editLine(params: Api.Manufacture.Line) {
  return demoRequest<Api.Manufacture.Line>({
    url: '/line/updateLine',
    method: 'post',
    data: {
      line: params
    }
  });
}

export function deleteLines(params: string[]) {
  return demoRequest({
    url: '/line/deleteLine',
    method: 'post',
    data: {
      ids: params
    }
  });
}

export function addLine(params: Api.Manufacture.Line) {
  return demoRequest<Api.Manufacture.Line>({
    url: '/line/insertLine',
    method: 'post',
    data: {
      line: params
    }
  });
}

export function addProduct(params: Api.Manufacture.Product) {
  return demoRequest<Api.Manufacture.Product>({
    url: '/product/insertProduct',
    method: 'post',
    data: { product: params }
  });
}

export function deleteProduct(params: string[]) {
  return demoRequest({
    url: '/product/deleteProduct',
    method: 'post',
    data: {
      ids: params
    }
  });
}

export function getProducts(params: Api.Manufacture.productSearchParams) {
  return demoRequest<Api.Manufacture.Product[]>({
    url: '/product/selectProduct',
    method: 'post',
    data: params
  });
}

export function getProductsDropDown() {
  return demoRequest({
    url: '/product/selectProductAll',
    method: 'post',
  }).then(res => {
    return res.data.records
  });
}

export function editProduct(params: Api.Manufacture.Product) {
  return demoRequest<Api.Manufacture.Product>({
    url: '/product/updateProduct',
    method: 'post',
    data: {
      line: params
    }
  });
}

export function publishProduct(id: string) {
  return demoRequest({
    url: '/line/publishProduct',
    method: 'post',
    data: {
      id
    }
  });
}

export function upload(params: { file: FormData; onProgressCallback: Function }) {
  return uploadRequest({
    url: '/file/upload',
    formData: params.file,
    uploadProgressCallback: params.onProgressCallback
  });
}

/** get station list */
export function getStations(params: Api.Manufacture.stationSearchParams) {
  return demoRequest<Api.Manufacture.StationList>({
    url: '/station/selectStation',
    method: 'post',
    data: params
  });
}

export function editStation(params: Api.Manufacture.Station) {
  return demoRequest<Api.Manufacture.Station>({
    url: '/station/updateStation',
    method: 'post',
    data: {
      station: params
    }
  });
}

export function deleteStations(params: string[]) {
  return demoRequest({
    url: '/station/deleteStation',
    method: 'post',
    data: {
      ids: params
    }
  });
}

export function addStation(params: Api.Manufacture.Line) {
  return demoRequest<Api.Manufacture.Line>({
    url: '/station/insertStation',
    method: 'post',
    data: {
      station: params
    }
  });
}
