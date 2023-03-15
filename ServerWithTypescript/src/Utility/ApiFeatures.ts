import { Query, Document, Model } from 'mongoose';

interface QueryString {
    keyword?: string;
    category?: string;
    price?: string;
    [key: string]: string | undefined;
}




export class ApiFeature<T extends Document, U extends Model<T>> {
  public query: Query<T[], T>;
  public queryStr: QueryString;

  constructor(query: Query<T[], T>, queryStr: QueryString) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search(): ApiFeature<T, U> {
    const keyword= this.queryStr.keyword ? {
      name: {
        $regex: this.queryStr.keyword,
        $options: "i"
      }
    } : {};

    
    
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter(): ApiFeature<T, U>{
    const copyStr:QueryString= {...this.queryStr}


    const removeFields: [string,string,string]=["keyword","page","limit"]

    removeFields.forEach(key=>delete copyStr[key])


    let qrystr = JSON.stringify(copyStr)
    qrystr= qrystr.replace(/\b(gt|gte|lte|lt)\b/g,(key)=>`$${key}`)
    
    

    this.query= this.query.find(JSON.parse( qrystr))
    // console.log(qrystr);
    
    
    return this
  }
  pagination(resultPerPage:number): ApiFeature<T, U>{

    const currPage:number =  Number(this.queryStr.page)|| 1;

    // for skiping products logic
    const skipProducts= resultPerPage * (currPage-1)
    this.query= this.query.limit(resultPerPage).skip(skipProducts)
    return this
  }
}


