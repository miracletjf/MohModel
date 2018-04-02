#### 父级菜单 { background: #f2f2f2,}
#### 一级菜单 { color: #555;background: #f8f8f8;border-bottom: solid 1px #eee; font-size: 0.9375rem; line-height: 2.7;}
               :hover{color:@mainColor;}
               :active{background: #f8f8f8,color:@mainColor}
#### 二级菜单   ul{} 
                :active{background: #fff;}
                a{border-bottom: dotted 1px #e4e4e4;line-height: 2.3;}
                :active{color:@mainColor;background: #F5F7FA;}
                :hover{color:@maincolor;background: #F1F5F9;}
                
                &:before {
                    content: "";
                    display: block;
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    width: 8px;
                    border-top: dashed 1px #999;
                }
                
                &:after {
                    content: "";
                    display: block;
                    position: absolute;
                    left: 16px;
                    top: 2px;
                    bottom: 2px;
                    width: 1px;
                    border-left: dashed 1px #999;
                }