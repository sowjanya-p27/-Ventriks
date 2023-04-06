import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data: IUnivercities = [];

  countryFilteredData: IUnivercities = [];

  filterdData: IUnivercities = [];
  visibleData: IUnivercities = [];
  searchedText: string= '';
  selectedCountry: string = 'All';
  countries: string[]=[];
  currentPage: number = 1; // default current page number
  pageSize: number = 10; // default number of items per page
  totalPages: number // total number of pages
  constructor(
    private http: HttpClient
  ){

  }

  ngOnInit(): void {
      this.getData();
  }
  onPageSizeChange(){
    this.totalPages = Math.ceil(this.filterdData.length/this.pageSize)
    this.visibleData = this.filterdData.slice(0, this.pageSize)

  }

  onChangeCountry(data: any){
    let d: any;
    if(this.selectedCountry!='All'){
      d = data.filter((univercity)=>{
        return univercity.country == this.selectedCountry;
      })
      // this.totalPages = Math.ceil(this.filterdData.length/this.pageSize);
    } else {
      d = data;
    }
    return d;
  }

  onSearchUnivercity(data){
    let d;
    let searchText = this.searchedText.trim().toLowerCase();
    if (!searchText) {
      return data;
    }
    d = data.filter((u:IUnivercity)=>{
      if(u.alpha_two_code.toLowerCase().includes(searchText) || u.country.toLowerCase().includes(searchText) || u.name.toLowerCase().includes(searchText) || u.web_pages[0].toLowerCase().includes(searchText)){
        return true;
      }
      return false;
    })
    return d;
  }


 

  // function to go to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.visibleData = this.filterdData.slice(this.currentPage*this.pageSize+1,(this.pageSize*(this.currentPage+1))+1)
      this.currentPage++;
      
    }
  }

  // function to go to the previous page
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.visibleData = this.filterdData.slice((this.currentPage-1)*this.pageSize+1,(this.pageSize*this.currentPage)+1)

    }
  }


  getData(){
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': 'https://sowjanya-p27.github.io/' });
    this.http.get<IUnivercities>(environment.apiUrl).subscribe((data: IUnivercities)=>{
      this.data = data
      this.countries = this.data.map((u)=>{
        return u.country;
      })

      this.countries = [...new Set(this.countries)];
      this.filterData();
    })
  }

  filterData() {
    let _data = this.data;
    _data = this.onChangeCountry(_data);
    _data = this.onSearchUnivercity(_data);
    this.filterdData = _data;
    this.visibleData = this.filterdData.slice(0,this.pageSize)
    this.totalPages = Math.ceil(this.filterdData.length/this.pageSize);
    this.currentPage=1;
  }

}

export type IUnivercities = IUnivercity[]

export interface IUnivercity {
  country: string
  web_pages: string[]
  "state-province": any
  name: string
  alpha_two_code: string
  domains: string[]
}
