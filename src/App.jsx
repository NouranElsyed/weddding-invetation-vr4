import React,{useState,useEffect,useRef} from "react";
import {C} from "./config";
import FRAME from "./assets/frame.webp";
import DIV from "./assets/divider.webp";
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
 useEffect(()=>{let un;(async()=>{try{
  const db=await claude.use("db"),user=await claude.use("user");
  if(!db||!user)return local();
  ref.current={db,uid:await user.id()};setMode("shared");
  un=db.collection("guestbook").onSnapshot(s=>setItems(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.t||0)-(a.t||0))),local);
 }catch(e){local()}})();return()=>un&&un()},[]);
 const send=async()=>{const n=name.trim(),m=msg.trim();if(!n||!m){setNote("Please add your name and your wishes.");return}
  const e={name:n.slice(0,60),msg:m.slice(0,400),t:Date.now()};
  try{
   if(mode==="shared")await ref.current.db.doc("guestbook/"+ref.current.uid).set(e);
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
function App(){
 const rsvp=()=>{const m=encodeURIComponent("Hello! I would love to attend "+C.groom+" & "+C.bride+"’s wedding.");window.open("https://wa.me/"+C.whatsapp+"?text="+m,"_blank")};
 return h("main",null,h(Petals),
  h("section",{className:"sec"},
   h("p",{className:"std"},"SAVE THE DATE"),
   h("div",{className:"card"},h("img",{src:FRAME,alt:""}),
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
    h("div",null,h("b",null,"WHERE"),h("div",{className:"big"},C.venue),h("div",null,C.address),h("a",{href:C.map,target:"_blank",rel:"noopener",style:{color:"var(--gold)",display:"inline-block",marginTop:"8px"}},"Open in Google Maps")),
    h("p",{style:{fontStyle:"italic"}},C.note)))),
  h("section",{className:"sec"},h(Reveal,null,
   h(Divider),h("h2",null,"Counting the days"),h(Countdown),
   h("button",{className:"btn",onClick:rsvp},"Confirm attendance"))),h("section",{className:"sec"},h(Reveal,null,h(Divider),h("h2",null,"Guestbook"),h(Guestbook))))}

export default App;
