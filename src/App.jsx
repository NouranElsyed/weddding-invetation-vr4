import React,{useState,useEffect,useRef} from "react";
import {C} from "./config";
import FRAME from "./assets/frame.webp";
import FRAMEP from "./assets/frame-portrait.webp";
import DIV from "./assets/divider.webp";
import MUSIC from "./assets/music.mp3";
const h=React.createElement;
function Divider(){return h("img",{src:DIV,alt:"",className:"divimg"})}
function Letters({text,delay}){return h("span",{"aria-label":text},[...text].map((c,i)=>h("span",{key:i,"aria-hidden":true,style:{animationDelay:(delay+i*.09)+"s"}},c)))}
function Reveal({children,className=""}){const r=useRef();const[v,s]=useState(false);
 useEffect(()=>{const o=new IntersectionObserver(e=>{if(e[0].isIntersecting){s(true);o.disconnect()}},{threshold:.25});o.observe(r.current);return()=>o.disconnect()},[]);
 return h("div",{ref:r,className:"rv "+(v?"in ":"")+className},children)}
function Countdown(){const t=new Date(C.date).getTime();const calc=()=>Math.max(0,t-Date.now());const[ms,s]=useState(calc);
 useEffect(()=>{const i=setInterval(()=>s(calc()),1000);return()=>clearInterval(i)},[]);
 const p=[["Days",Math.floor(ms/864e5)],["Hours",Math.floor(ms/36e5)%24],["Min",Math.floor(ms/6e4)%60],["Sec",Math.floor(ms/1e3)%60]];
 return h("div",{className:"cd",role:"timer"},p.map(([l,n])=>h("div",{key:l},h("strong",null,String(n).padStart(2,"0")),h("small",null,l))))}
function Petals(){const a=Array.from({length:9},(_,i)=>({l:(i*11+7)%100,d:14+(i*3)%9,w:i*2.3}));
 return h("div",{"aria-hidden":true},a.map((p,i)=>h("i",{key:i,className:"pet",style:{left:p.l+"%",animationDuration:p.d+"s",animationDelay:p.w+"s"}})))}
function Guestbook(){
 const[items,setItems]=useState([]),[name,setName]=useState(""),[msg,setMsg]=useState(""),[mode,setMode]=useState("wait"),[note,setNote]=useState("");
 const ref=useRef({});
 const local=()=>{setMode("local");try{setItems(JSON.parse(localStorage.getItem("gb")||"[]"))}catch(e){}};
 const load=()=>fetch(C.sheetUrl).then(r=>r.json()).then(d=>{if(d.ok)setItems(d.items.map((x,i)=>({...x,id:"s"+i})))}).catch(()=>{});
 useEffect(()=>{let un;if(C.sheetUrl){setMode("sheet");load();return}(async()=>{try{
  const db=await claude.use("db"),user=await claude.use("user");
  if(!db||!user)return local();
  ref.current={db,uid:await user.id()};setMode("shared");
  un=db.collection("guestbook").onSnapshot(s=>setItems(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.t||0)-(a.t||0))),local);
 }catch(e){local()}})();return()=>un&&un()},[]);
 const send=async()=>{const n=name.trim(),m=msg.trim();if(!n||!m){setNote("Please add your name and your wishes.");return}
  const e={name:n.slice(0,60),msg:m.slice(0,400),t:Date.now()};
  try{
   if(mode==="sheet"){setItems([{...e,id:"n"+e.t},...items]);await fetch(C.sheetUrl,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({name:e.name,msg:e.msg})});setTimeout(load,1500)}else if(mode==="shared")await ref.current.db.doc("guestbook/"+ref.current.uid).set(e);
   else{const l=[{...e,id:"l"+e.t},...items];setItems(l);try{localStorage.setItem("gb",JSON.stringify(l))}catch(x){}}
   setMsg("");setNote("Thank you! Your wishes were sent.");
  }catch(x){setNote("Could not send your wishes. Please try again.")}};
 return h("div",{className:"gb"},
  h("input",{placeholder:"Enter your name*",value:name,maxLength:60,onChange:e=>setName(e.target.value),"aria-label":"Your name"}),
  h("textarea",{placeholder:"Enter your wishes*",value:msg,maxLength:400,onChange:e=>setMsg(e.target.value),"aria-label":"Your wishes"}),
  h("div",{className:"gbrow"},h("small",{role:"status"},note),h("button",{className:"btn",onClick:send},"Send wishes")),
  mode==="local"&&h("small",{className:"gbnote"},"Wishes are saved on this device only."),
  h("div",{className:"gbl"},items.length===0?h("p",{className:"gbe"},"Be the first to leave a wish."):items.map(i=>h("div",{key:i.id,className:"gbc"},
   h("div",{className:"gbh"},h("b",null,i.name),h("small",null,new Date(i.t||0).toLocaleString([],{dateStyle:"short",timeStyle:"short"}))),
   h("p",null,i.msg)))))}
function Venue(){
 const svg='<rect width="440" height="326" fill="#0c2c18"/><path d="M0 190Q70 160 110 215T190 326H0Z" fill="#0b3b3a" opacity=".8"/><g stroke="#d9b873" fill="none" stroke-linecap="round" opacity=".38"><path d="M130 0L170 326M250 0L290 326M330 0L370 326" stroke-width="3"/><path d="M0 70L440 40M0 150L440 120M60 250L440 215" stroke-width="3"/><path d="M200 0L240 326M0 110L440 80M90 300L440 270" stroke-width="6"/></g><path d="M250 198c-14-18-20-27-20-37a20 20 0 0 1 40 0c0 10-6 19-20 37z" fill="#e04b3f"/><circle cx="250" cy="161" r="7" fill="#f5ecd8"/><text x="250" y="222" fill="#f1dba6" font-size="13" text-anchor="middle">'+C.venue+'</text>';
 return h("div",{className:"venue"},
  h("h2",null,"Wedding Reception Venue"),h("div",null,C.venue),h("div",{style:{fontStyle:"italic",color:"var(--gold2)"}},C.hall),h("div",null,C.address),
  h("a",{className:"map",href:C.map,target:"_blank",rel:"noopener","aria-label":"Open the venue in Google Maps"},
   h("svg",{viewBox:"0 0 440 326",preserveAspectRatio:"xMidYMid slice","aria-hidden":true,dangerouslySetInnerHTML:{__html:svg}}),
   h("div",{className:"chip"},h("b",null,C.venue),C.hall,h("br"),C.address,h("div",null,"View on Google Maps"))),
  h("a",{className:"dir",href:C.directions,target:"_blank",rel:"noopener"},"\u27A4 Get directions"))}
function Calendar(){
 const d=new Date(C.date),y=d.getFullYear(),m=d.getMonth(),day=d.getDate(),off=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();
 const cells=[...Array(off).fill(null),...Array.from({length:n},(_,i)=>i+1)];
 const heart='<path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z"/>';
 return h("div",{className:"cal"},h("h3",null,d.toLocaleString("en",{month:"long"})+" "+y),
  h("div",{className:"wk"},["Mo","Tu","We","Th","Fr","Sa","Su"].map(x=>h("span",{key:x},x))),
  h("div",{className:"dg"},cells.map((c,i)=>h("span",{key:i,className:c===day?"on":""},
   c===day&&h("svg",{viewBox:"0 0 24 24","aria-hidden":true,dangerouslySetInnerHTML:{__html:heart}}),c&&h("b",null,c)))))}
function Music(){
 const a=useRef(),[on,setOn]=useState(false);
 const play=()=>{const el=a.current;if(!el)return Promise.resolve(false);try{el.volume=0}catch(x){}return el.play().then(()=>{setOn(true);let v=0;const i=setInterval(()=>{v=Math.min(.7,v+.05);try{el.volume=v}catch(x){}if(v>=.7)clearInterval(i)},120);return true}).catch(()=>false)};
 useEffect(()=>{const ev=["click","touchend","keydown"];const rm=()=>ev.forEach(e=>window.removeEventListener(e,f));
  function f(e){if(e.target.closest&&e.target.closest(".mus"))return;play().then(ok=>{if(ok)rm()})}
  ev.forEach(e=>window.addEventListener(e,f));return rm},[]);
 const toggle=()=>{if(on){a.current.pause();setOn(false)}else play()};
 return h("div",null,h("audio",{ref:a,src:MUSIC,loop:true,preload:"auto"}),
  h("button",{className:"mus"+(on?" on":""),onClick:toggle,"aria-label":on?"Pause music":"Play music","aria-pressed":on},h("i"),h("i"),h("i")))}
function Intro({st,onOpen}){
 const i=(C.groom[0]||"")+"&"+(C.bride[0]||"");
 return h("div",{className:"intro"+(st?" open":""),"aria-hidden":st?true:undefined},
  h("div",{className:"dl"}),h("div",{className:"dr"}),
  h("div",{className:"ic"},
   h("p",{className:"std"},"YOU ARE INVITED"),h(Divider),
   h("div",{className:"inm"},C.groom),h("div",{className:"inamp"},"&"),h("div",{className:"inm"},C.bride),
   h("button",{className:"seal",onClick:onOpen,disabled:!!st,"aria-label":"Open invitation"},i),
   h("p",{className:"ol"},"Open invitation")))}
function App(){
 const rsvp=()=>{const m=encodeURIComponent("Hello! I would love to attend "+C.groom+" & "+C.bride+"’s wedding.");window.open("https://wa.me/"+C.whatsapp+"?text="+m,"_blank")};
 const[st,setSt]=useState(0);return h(React.Fragment,null,h(Music),st<2&&h(Intro,{st,onOpen:()=>{setSt(1);setTimeout(()=>setSt(2),2200)}}),st>0&&h("main",null,h(Petals),
  h("section",{className:"sec"},
   h("p",{className:"std"},"SAVE THE DATE"),
   h("div",{className:"card"},h("img",{src:FRAMEP,alt:"",className:"fp"}),h("img",{src:FRAME,alt:"",className:"fl"}),
    h("div",{className:"names"},
     h("div",{className:"nm"},h(Letters,{text:C.groom,delay:1.4})),
     h("div",{className:"amp"},"&"),
     h("div",{className:"nm"},h(Letters,{text:C.bride,delay:2.7})),
     h("p",{className:"sub"},C.tagline))),
   h("a",{className:"hint",href:"#details",style:{color:"var(--gold)",textDecoration:"none"}},"Scroll for details ⌄")),
  h("section",{className:"sec",id:"details"},h(Reveal,null,
   h(Divider),h("h2",null,"Join us"),
   h("div",{className:"info"},
    h("div",null,h("b",null,"WHEN"),h("div",{className:"big"},C.dateText),h("div",null,C.timeText)),
    h("div",null,h("b",null,"WHERE"),h("div",{className:"big"},C.venue),h("div",{style:{fontStyle:"italic",color:"var(--gold2)"}},C.hall),h("div",null,C.address),h("a",{href:C.map,target:"_blank",rel:"noopener",style:{color:"var(--gold)",display:"inline-block",marginTop:"8px"}},"Open in Google Maps"))))),
  h("section",{className:"sec"},h(Reveal,null,h(Divider),h(Venue))),h("section",{className:"sec"},h(Reveal,null,h(Divider),h("h2",null,"Counting the days"),h(Countdown),h(Calendar))),h("section",{className:"sec"},h(Reveal,null,h(Divider),h("h2",null,"Guestbook"),h(Guestbook)))))}

export default App;
