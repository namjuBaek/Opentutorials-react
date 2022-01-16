import React, { Component } from 'react';
import TOC from "./components/TOC"
import ReadContent from "./components/ReadContent"
import CreateContent from "./components/CreateContent"
import UpdateContent from "./components/UpdateContent"
import Subject from "./components/Subject"
import Control from "./components/Control"
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.max_content_id = 3;
    this.state = {
      mode:'welcome',
      selected_content_id:1,
      subject:{title:'WEB', sub:'World Wide Web!'},
      welcome:{title:'Welcome', desc:'Hello, React!!'},
      contents:[
        {id:1, title:'HTML', desc:'HTML is information....'},
        {id:2, title:'CSS', desc:'CSS is for design....'},
        {id:3, title:'JavaScript', desc:'JavaScript is for interactive....'}
      ]
    }
  }
  getReadContent() {
    var i = 0;
    while (i <this.state.contents.length) {
      var data = this.state.contents[i];
      if (data.id === this.state.selected_content_id) {
        return data;
        break;
      }
      i = i + 1;
    }
  }
  getContent() {
    var _title, _desc, _article, _content = null;
    if (this.state.mode === 'welcome') {
      _title = this.state.welcome.title;
      _desc = this.state.welcome.desc;
      _article = <ReadContent title={_title} desc={_desc}></ReadContent>
    } else if (this.state.mode === 'read') {
      _content = this.getReadContent();
      _article = <ReadContent title={_content.title} desc={_content.desc}></ReadContent>
    } else if (this.state.mode === 'create') {
      _article = <CreateContent onSubmit={function(_title, _desc) {
        this.max_content_id = this.max_content_id + 1;
      
        // this.state.contents.push(
        //   {id:this.max_content_id, title:_title, desc:_desc}  
        // ) -> 기존 배열에 값을 추가하여 원본을 바꾼다.
        // var _contents = this.state.contents.concat(
        //   {id:this.max_content_id, title:_title, desc:_desc}  
        // ) 새로운 배열 리턴
        
        var _contents = Array.from(this.state.contents);
        _contents.push(
          {id:this.max_content_id, title:_title, desc:_desc}
        )
        this.setState({
          contents:_contents,
          mode:'read',
          selected_content_id:this.max_content_id
        });

        //var newContents = Array.from(this.state.contents) -> 새 배열 생성
        //var a = {name='egoing'};
        //var b = Object.assign({}, a); -> 새 객체 생성
      }.bind(this)}></CreateContent>
    } else if (this.state.mode === 'update') {
      _content = this.getReadContent();
      _article = <UpdateContent data={_content} onSubmit={
        function(_id, _title, _desc) {
          var _newContents = Array.from(this.state.contents); //원본 불변성
          var i = 0;
          while (i < _newContents.length) {
            if (_newContents[i].id === _id) {
              _newContents[i] = {id:_id, title:_title, desc:_desc};
              break;
            }
            i = i + 1;
          }
          this.setState({
            contents:_newContents,
            mode:'read'
          })  
      }.bind(this)}></UpdateContent>
    } else if (this.state.mode === 'delete') {
      
    }
    return _article;
  }
  render() {
    return (
      <div className="App">
        <Subject 
          title={this.state.subject.title} 
          sub={this.state.subject.sub}
          onChangePage={function(){
            this.setState({mode:'welcome'});
          }.bind(this)}>  
        </Subject>
        <TOC data={this.state.contents}
          onChangePage={function(selected_id){
            this.setState({
              mode:'read',
              selected_content_id:Number(selected_id)
            })
          }.bind(this)}
        ></TOC>
        <Control
          onChangeMode={ function(_mode) {
            if (_mode === 'delete' && this.state.mode != 'welcome') {
              if (window.confirm('삭제하시겠습니까?')) { //확인 클릭 시 true
                var _contents = Array.from(this.state.contents);
                var i = 0;
                while (i < this.state.contents.length) {
                  if (_contents[i].id === this.state.selected_content_id) { 
                    _contents.splice(i ,1);
                    break;
                  }
                  i = i + 1;
                }
                this.setState({
                  contents:_contents,
                  mode:'welcome'
                });
                alert("삭제되었습니다.");
              }
            } else {
              this.setState({
                mode:_mode
              })
            }
          }.bind(this)}
        ></Control>
        {this.getContent()}
      </div>
    )
  }
}

export default App;
