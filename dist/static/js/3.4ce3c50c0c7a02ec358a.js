webpackJsonp([3],{DkU6:function(t,n){},"Sgn/":function(t,n,e){"use strict";n.b=function(){var t=a()({},r.b,{channel:"singer",page:"list",key:"all_all_all",pagesize:100,pagenum:1,hostUin:0,needNewCode:0,platform:"yqq",gtk:1664029744});return Object(s.a)("https://c.y.qq.com/v8/fcg-bin/v8.fcg",t,r.c)},n.a=function(t){var n=a()({},r.b,{hostUin:0,needNewCode:0,platform:"yqq",order:"listen",begin:0,num:80,songstatus:1,singermid:t});return Object(s.a)("https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg",n,r.c)};var i=e("woOf"),a=e.n(i),s=e("Gak4"),r=e("T452")},lEJ1:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=e("Dd8w"),a=e.n(i),s=e("NYxO"),r=e("Sgn/"),c=e("T452"),o=e("PvFA"),u=e("+kKk"),g={name:"singer-detail",data:function(){return{songs:[]}},components:{MusicList:e("kvay").a},computed:a()({},Object(s.c)(["singer"]),{title:function(){return this.singer.name},bgImage:function(){return this.singer.avatar}}),methods:{_getSingerDetail:function(){var t=this;this.singer.id?Object(r.a)(this.singer.id).then(function(n){if(n.code===c.a){var e=t._normalizeSongList(n.data.list);return Object(u.a)(e)}}).then(function(n){t.songs=n}):this.$router.back()},_normalizeSongList:function(t){var n=[];return t.forEach(function(t){var e=t.musicData;e.songid&&e.albummid&&n.push(Object(o.a)(e))}),n}},created:function(){this._getSingerDetail()}},l={render:function(){var t=this.$createElement,n=this._self._c||t;return n("transition",{attrs:{name:"slide"}},[n("MusicList",{attrs:{songs:this.songs,title:this.title,bgImage:this.bgImage}})],1)},staticRenderFns:[]};var f=e("VU/8")(g,l,!1,function(t){e("DkU6")},"data-v-3dba0832",null);n.default=f.exports}});
//# sourceMappingURL=3.4ce3c50c0c7a02ec358a.js.map