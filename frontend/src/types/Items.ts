export interface Items {
  _id: string
  title:string
  description:string
  category:string
  type:string
  size:string
  condition:string
  status:string
  point:string
  images:string[]
  createdAt: string
}

export interface FormItemType {
  title:        string;
  description:  string;
  category:     string;
  type:         string;
  point:        string;
  size:         string;
  condition:    string;
  images:       string[];         
}
export interface UploadedImage {
  url:          string;
  originalName: string;
  filename:     string;            
}