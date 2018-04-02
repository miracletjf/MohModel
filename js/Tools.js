/**
 * Created by MiracleTJF on 2018/3/29.
 */

//给Element元素添加appendHtml (by:张鑫旭)
HTMLElement.prototype.appendHTML = function (html) {
    var divTemp = document.createElement("div"),nodes = null,
        fragment = document.createDocumentFragment();
    divTemp.innerHTML = html;
    nodes = divTemp.childNodes;

    for(var i=0;i<nodes.length;i++){
        fragment.appendChild(nodes[i].cloneNode(true));
    }
    this.appendChild(fragment);
    //清理
    nodes = null;
    fragment = null;

};