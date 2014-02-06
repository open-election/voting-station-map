//=============================================================================
// marker
//=============================================================================
var MarkerCluster;


function MapOverlay(map,data,manager_ref,select_comp_list) {
    if(!MarkerCluster){
        MarkerCluster=new MarkerClusterer(map);
        MarkerCluster.setGridSize(50);
        MarkerCluster.setMaxZoom(15);
    }
    this.select_comp_list=select_comp_list;
    this.map_ = map;
    this.data_ = data;
    this.id=data.id;
    this.info= new google.maps.InfoWindow();
    this.info.setOptions({"disableAutoPan":false});//吹き出しを地図の中心に持ってくるか
    this.marker_color={1:'FC7790',5:'32ceff',99:'44f186'};//1:未完了 5:完了　99:ブックマーク時のアイコン色
    this.latlng=null;
    var geo=eval("a="+this.data_.geometry);
    if(geo.coordinates){
        if(!isNaN(parseInt(geo.coordinates[1]))&& !isNaN(parseInt(geo.coordinates[0]))){
            this.latlng=new google.maps.LatLng(geo.coordinates[1],geo.coordinates[0]);
        }else{
            this.latlng=new google.maps.LatLng("39.8781539650443","139.84579414129257");//往く当てが無いなら富士山でも登りたい
        }
    }

    //this.marker = new google.maps.Marker({'map': this.map_,'position': this.latlng});
    this.marker = new google.maps.Marker();
    this.marker.setPosition(this.latlng);
    MarkerCluster.addMarker(this.marker); // markerclusterを表示（間引き表示）

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
    var color=is_select?this.marker_color[99]:this.marker_color[status_id];
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
        t_str += '<br /><br /><a href="https://twitter.com/intent/tweet?url=null&text=' + encodeURIComponent(TWEET_FORMAT.replace('<$subject$>',subject)) + '" class="twitter-mention-button" data-lang="ja">Tweet to @posterdone</a>';
        if(navigator.userAgent.search(/iPhone|Android/) != -1){
          t_str += '<br /><br /><a style="text-decoration: underline;" href="twitter://post?message=' + encodeURIComponent(TWEET_FORMAT.replace('<$subject$>',subject)) + '"</a>twitterアプリでツイート</a>';
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
MapOverlay.prototype.delete_marker=function(){
    MarkerCluster.removeMarker(this.marker);
}

