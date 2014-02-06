//=============================================================================
// marker
//=============================================================================
var MarkerCluster;
//markerのSTATUS種類　1:未完了 5:完了　99:ブックマーク時のアイコン色
MAKER_STATUS_S={
    0:{'color':'336699'},//default
    1:{'color':'FC7790'},
    5:{'color':'32ceff'},
    99:{'color':'44f186'}//マーク
};
MARKERCLUSTER_GRIDSIZE=50;
MARKERCLUSTER_MAXZOOM=15;
MARKERCLUSTER_IMG_DIR="js/markers/";//マーカのディレクトリ　「markers/ステータスID/1〜5.png」

function MapOverlay(map,data,manager_ref,select_comp_list) {
    if(!MarkerCluster){
        MarkerCluster={};
        for(i in MAKER_STATUS_S){
            MarkerCluster[i]=new MarkerClusterer(map,[],{
                imagePath:MARKERCLUSTER_IMG_DIR+i+"/m",
                imageExtension:"png"
            });
            MarkerCluster[i].setGridSize(MARKERCLUSTER_GRIDSIZE);
            MarkerCluster[i].setMaxZoom(MARKERCLUSTER_MAXZOOM);
        }
    }

    this.select_comp_list=select_comp_list;
    this.map_ = map;
    this.data_ = data;
    this.id=data.id;
    this.info= new google.maps.InfoWindow();
    this.info.setOptions({"disableAutoPan":false});//吹き出しを地図の中心に持ってくるか
    this.latlng=null;
    this.status_id=MAKER_STATUS_S[data.status.id]?data.status.id:0;//MAKER_STATUS_Sに定義された物以外はdefaultのマークに

    var geo=eval("a="+this.data_.geometry);
    if(geo.coordinates){
        if(!isNaN(parseInt(geo.coordinates[1]))&& !isNaN(parseInt(geo.coordinates[0]))){
            this.latlng=new google.maps.LatLng(geo.coordinates[1],geo.coordinates[0]);
        }else{
            this.latlng=new google.maps.LatLng("39.8781539650443","139.84579414129257");//往くアテが無いなら富士山でも登りたい
        }
    }
    //this.marker = new google.maps.Marker({'map': this.map_,'position': this.latlng});
    this.marker = new google.maps.Marker();
    this.marker.setPosition(this.latlng);
    MarkerCluster[this.status_id].addMarker(this.marker); // markerclusterを表示（間引き表示）

    // this.marker.setMap(map);//マーカーでの表示


    /* マーカーがクリックされた時 */
    var self=this;
    google.maps.event.addListener(this.marker, 'click', function() {
        self.show_info(true);
    });
}
/**
 * アイコン生成
 */
MapOverlay.prototype.createIco_img = function(is_select) {
    var status_id=this.data_.status.id;
    var color=is_select?MAKER_STATUS_S[99].color:MAKER_STATUS_S[status_id].color;
    var status= this.data_.status.name.substring(0,1);
    return "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+status+"|"+color+"|000000";
}

/**
 * 吹き出し表示
 * @param flg 表示・非表示
 */

MapOverlay.prototype.show_info = function(flg) {
    if(flg){
        if(currentInfoWindow){
            currentInfoWindow.close();
        }
        this.info.open(this.map_,this.marker);
        currentInfoWindow=this.info;
        twttr.widgets.load();
    }else{
        this.info.close();
        currentInfoWindow=undefined;
    }
}

MapOverlay.prototype.refresh=function(){
    var id=this.id;
    var description=this.data_.description;
    var subject=this.data_.subject;
    var is_select=this.select_comp_list[id];
    //完了時と未貼り付け時で吹き出しを変える
    if(this.data_.status.id==1){
        //未貼り付け
        var t_str='完了したらtwitterに報告<br/><textarea id="tweet_txt_'+id+'" class="tweet_txt" name="tweet_txt" >'+TWEET_FORMAT.replace('<$subject$>',subject)+'</textarea>';
<<<<<<< HEAD
        t_str += '<br /><br /><a href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(TWEET_FORMAT.replace('<$subject$>',subject)) + '&url=null" class="twitter-mention-button" data-lang="ja">Tweet to @posterdone</a>';
        if(navigator.userAgent.search(/iPhone|Android/) != -1){
            t_str += '<br /><br /><a style="text-decoration: underline;" href="twitter://post?message=' + encodeURIComponent(TWEET_FORMAT.replace('<$subject$>',subject)) + '"</a>twitterアプリでツイート</a>';
=======
        t_str += '<br /><br /><a href="https://twitter.com/intent/tweet?url=null&text=' + encodeURIComponent(TWEET_FORMAT.replace('<$subject$>',subject)) + '" class="twitter-mention-button" data-lang="ja">Tweet to @posterdone</a>';
        if(navigator.userAgent.search(/iPhone|Android/) != -1){
          t_str += '<br /><br /><a style="text-decoration: underline;" href="twitter://post?message=' + encodeURIComponent(TWEET_FORMAT.replace('<$subject$>',subject)) + '"</a>twitterアプリでツイート</a>';
>>>>>>> 19d999e75c43815b342d1aa1981319dc8bb5bfed
        }
        //this.info.setContent('<div class="info_w_contents open" style="margin: 5px;">' +'ID:'+id+'<br/>'+subject + '<br/>' + description+'<br/>●'+this.data_.status.name+'<hr/><a onclick="book_mark(this,'+id+')" class="btn comp'+(is_select?" selected":"")+'" >Mark</a></div>');
        this.info.setContent('<div class="info_w_contents open" style="margin: 5px;">' +'ID:'+id+'<br/>'+subject + '<br/>' + description+'<br/>●'+this.data_.status.name+'<hr/>'+t_str+'</div>');
    }else{
        //完了・その他
        this.info.setContent('<div class="info_w_contents close other" style="margin: 5px;">' +'ID:'+id+'<br/>'+subject + '<br/>' + description+'<br/>●'+this.data_.status.name+"</div>");
    }
    this.marker.setIcon(this.createIco_img(is_select));
}


MapOverlay.prototype.get_marker_position=function(){
    return this.latlng;
}
MapOverlay.prototype.get_marker=function(){
    return this.marker;
}
/**
 * markerの削除
 */
MapOverlay.prototype.delete_marker=function(){
    MarkerCluster[this.status_id].removeMarker(this.marker);

}
/**
 * markerの一括消去 staticメソッド的に動作
 */
MapOverlay.prototype.clear_markers=function(){
    for(i in MarkerCluster){
        MarkerCluster[i].clearMarkers();
    }
}
