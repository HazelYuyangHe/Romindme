"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Person, DateEntry, StoryEntry } from "@/types";
import { getZodiac, getAge, daysUntilBirthday } from "@/utils/zodiac";

const COLORS = ["#FF6B9D","#FF8C42","#FFD93D","#6BCB77","#4D96FF","#C77DFF","#FF6B6B","#00C9A7"];
const TAGS = ["Charming","Funny","Mysterious","Athletic","Artistic","Intellectual","Warm","Ambitious"];
const MOODS = ["🥰","😊","😐","😬","❌"];
const STORY_MOODS = ["sweet","awkward","funny","red-flag","memorable"];
const STORY_MOOD_EMOJI: Record<string,string> = { sweet:"🥰", awkward:"😬", funny:"😂", "red-flag":"🚩", memorable:"⭐" };

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState("people");
  const [people, setPeople] = useState<Person[]>([]);
  const [dates, setDates] = useState<DateEntry[]>([]);
  const [stories, setStories] = useState<StoryEntry[]>([]);
  const [search, setSearch] = useState("");
  const [viewPerson, setViewPerson] = useState<Person|null>(null);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [showDateForm, setShowDateForm] = useState(false);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [editPerson, setEditPerson] = useState<Person|null>(null);
  const [storyPersonId, setStoryPersonId] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const [pForm, setPForm] = useState({ name:"",nickname:"",height:"",birthday:"",occupation:"",contact:"",color:COLORS[0],tags:[] as string[],sparkRating:3,notes:"" });
  const [dForm, setDForm] = useState({ personId:"",date:today,time:"",location:"",mood:"",notes:"" });
  const [sForm, setSForm] = useState({ content:"",date:today,moodTag:"sweet" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") { fetchPeople(); fetchDates(); fetchStories(); }
  }, [status]);

  const fetchPeople = () => fetch("/api/people").then(r=>r.json()).then(setPeople);
  const fetchDates = () => fetch("/api/dates").then(r=>r.json()).then(setDates);
  const fetchStories = () => fetch("/api/stories").then(r=>r.json()).then(setStories);

  const savePerson = async () => {
    if (!pForm.name.trim()) return;
    const method = editPerson ? "PUT" : "POST";
    const url = editPerson ? `/api/people/${editPerson.id}` : "/api/people";
    await fetch(url, { method, headers:{"Content-Type":"application/json"}, body: JSON.stringify({...pForm, height: pForm.height ? Number(pForm.height) : null}) });
    fetchPeople(); setShowPersonForm(false); setEditPerson(null);
  };

  const deletePerson = async (id: string) => {
    await fetch(`/api/people/${id}`, { method:"DELETE" });
    fetchPeople(); fetchDates(); fetchStories(); setViewPerson(null);
  };

  const saveDate = async () => {
    if (!dForm.personId || !dForm.date) return;
    await fetch("/api/dates", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(dForm) });
    fetchDates(); setShowDateForm(false); setDForm({personId:"",date:today,time:"",location:"",mood:"",notes:""});
  };

  const deleteDate = async (id: string) => { await fetch(`/api/dates/${id}`,{method:"DELETE"}); fetchDates(); };

  const saveStory = async () => {
    if (!sForm.content.trim()) return;
    await fetch("/api/stories", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...sForm, personId: storyPersonId}) });
    fetchStories(); setShowStoryForm(false); setSForm({content:"",date:today,moodTag:"sweet"});
  };

  const deleteStory = async (id: string) => { await fetch(`/api/stories/${id}`,{method:"DELETE"}); fetchStories(); };

  const openEdit = (p: Person) => {
    setPForm({name:p.name,nickname:p.nickname||"",height:p.height?.toString()||"",birthday:p.birthday||"",occupation:p.occupation||"",contact:p.contact||"",color:p.color,tags:p.tags,sparkRating:p.sparkRating,notes:p.notes||""});
    setEditPerson(p); setViewPerson(null); setShowPersonForm(true);
  };

  const tagToggle = (t: string) => setPForm(f=>({...f,tags:f.tags.includes(t)?f.tags.filter(x=>x!==t):[...f.tags,t]}));

  const filtered = people.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.nickname||"").toLowerCase().includes(search.toLowerCase()));
  const upcoming = dates.filter(d=>d.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
  const past = dates.filter(d=>d.date<today).sort((a,b)=>b.date.localeCompare(a.date));
  const getPerson = (id: string) => people.find(p=>p.id===id);

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center text-rose-400">Loading...</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-rose-50 pb-20">
      <div className="bg-gradient-to-r from-rose-400 to-orange-400 px-5 py-4 flex justify-between items-center">
        <div>
          <div className="text-white font-bold text-xl">💕 RomindMe</div>
          <div className="text-white/80 text-xs">Hi, {session?.user?.name || session?.user?.email}</div>
        </div>
        <button onClick={()=>signOut()} className="text-white/80 text-xs border border-white/40 rounded-full px-3 py-1">Sign out</button>
      </div>

      <div className="flex bg-white border-b border-rose-100">
        {[["people","👤 People"],["calendar","📅 Calendar"],["reminders","⏰ Reminders"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} className={`flex-1 py-3 text-xs font-semibold border-b-2 transition ${tab===k?"border-rose-400 text-rose-500":"border-transparent text-gray-400"}`}>{l}</button>
        ))}
      </div>

      <div className="p-4">
        {tab==="people" && <>
          <div className="flex gap-2 mb-4">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search..." className="flex-1 border border-rose-200 rounded-full px-4 py-2 text-sm outline-none" />
            <button onClick={()=>{setPForm({name:"",nickname:"",height:"",birthday:"",occupation:"",contact:"",color:COLORS[people.length%COLORS.length],tags:[],sparkRating:3,notes:""});setEditPerson(null);setShowPersonForm(true);}}
              className="bg-rose-400 text-white rounded-full px-4 py-2 text-sm font-semibold">+ Add</button>
          </div>
          {filtered.length===0 && <div className="text-center text-gray-300 mt-16">💌 No people yet</div>}
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p=>{
              const z=getZodiac(p.birthday||"");
              const days=p.birthday?daysUntilBirthday(p.birthday):null;
              return (
                <div key={p.id} onClick={()=>setViewPerson(p)} className="bg-white rounded-2xl p-4 cursor-pointer shadow-sm relative" style={{borderTop:`3px solid ${p.color}`}}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2" style={{background:p.color}}>{p.name[0]}</div>
                  <div className="font-bold text-sm">{p.name}</div>
                  {p.nickname && <div className="text-xs text-gray-400">"{p.nickname}"</div>}
                  <div className="text-xs text-gray-400 mt-1">{p.height && `📏${p.height}cm `}{z && `${z.emoji}${z.name}`}</div>
                  <div className="text-xs mt-1">{"⭐".repeat(p.sparkRating)}{"☆".repeat(5-p.sparkRating)}</div>
                  {days!==null && days<=30 && <div className="absolute top-2 right-2 bg-yellow-300 text-xs font-bold rounded-full px-2 py-0.5">🎂{days}d</div>}
                </div>
              );
            })}
          </div>
        </>}

        {tab==="calendar" && <>
          <div className="flex justify-between items-center mb-4">
            <div className="font-bold text-base">Date Log</div>
            <button onClick={()=>setShowDateForm(true)} className="bg-rose-400 text-white rounded-full px-4 py-2 text-sm font-semibold">+ Add</button>
          </div>
          {upcoming.length===0 && past.length===0 && <div className="text-center text-gray-300 mt-16">📅 No dates yet</div>}
          {upcoming.map(d=>{
            const p=getPerson(d.personId);
            return p ? (
              <div key={d.id} className="bg-white rounded-xl p-3 mb-2 flex justify-between items-start shadow-sm" style={{borderLeft:`4px solid ${p.color}`}}>
                <div>
                  {d.date===today && <span className="bg-rose-400 text-white text-xs rounded-full px-2 py-0.5 mr-1">Today</span>}
                  <span className="font-semibold text-sm">{p.name}</span>
                  <div className="text-xs text-gray-400">{d.date} {d.time} {d.location && `· 📍${d.location}`}</div>
                  {d.mood && <div className="text-base mt-1">{MOODS[["loved","good","neutral","awkward","bad"].indexOf(d.mood)]}</div>}
                </div>
                <button onClick={()=>deleteDate(d.id)} className="text-rose-200 text-lg leading-none">×</button>
              </div>
            ) : null;
          })}
          {past.length>0 && <>
            <div className="text-xs text-gray-300 text-center my-3">── Past dates ──</div>
            {past.slice(0,5).map(d=>{
              const p=getPerson(d.personId);
              return p ? (
                <div key={d.id} className="bg-gray-50 rounded-xl p-3 mb-2 flex justify-between items-start opacity-60" style={{borderLeft:`4px solid ${p.color}`}}>
                  <div>
                    <span className="font-semibold text-sm">{p.name}</span>
                    <div className="text-xs text-gray-400">{d.date} {d.location && `· ${d.location}`}</div>
                  </div>
                  <button onClick={()=>deleteDate(d.id)} className="text-gray-300 text-lg leading-none">×</button>
                </div>
              ) : null;
            })}
          </>}
        </>}

        {tab==="reminders" && <>
          <div className="font-bold text-base mb-3">🎂 Birthdays</div>
          {people.filter(p=>p.birthday).sort((a,b)=>daysUntilBirthday(a.birthday!)!-daysUntilBirthday(b.birthday!)!).map(p=>{
            const days=daysUntilBirthday(p.birthday!);
            const age=getAge(p.birthday!);
            const z=getZodiac(p.birthday!);
            return (
              <div key={p.id} className="bg-white rounded-xl p-3 mb-2 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{background:p.color}}>{p.name[0]}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{p.name} {z && <span className="text-xs">{z.emoji}{z.name}</span>}</div>
                  <div className="text-xs text-gray-400">{p.birthday} · {age} yrs</div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${days!<=7?"text-rose-400":days!<=30?"text-orange-400":"text-gray-300"}`}>{days}</div>
                  <div className="text-xs text-gray-400">days</div>
                </div>
              </div>
            );
          })}
          <div className="font-bold text-base mt-5 mb-3">📅 Upcoming Dates</div>
          {upcoming.slice(0,3).map(d=>{
            const p=getPerson(d.personId);
            const diff=Math.ceil((new Date(d.date).getTime()-new Date(today).getTime())/86400000);
            return p ? (
              <div key={d.id} className="bg-white rounded-xl p-3 mb-2 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{background:p.color}}>{p.name[0]}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-xs text-gray-400">{d.date} {d.location && `· ${d.location}`}</div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${diff===0?"text-rose-400":"text-orange-400"}`}>{diff===0?"Today":diff}</div>
                  {diff!==0 && <div className="text-xs text-gray-400">days</div>}
                </div>
              </div>
            ) : null;
          })}
        </>}
      </div>

      {viewPerson && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50" onClick={()=>setViewPerson(null)}>
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{background:viewPerson.color}}>{viewPerson.name[0]}</div>
                <div>
                  <div className="font-bold text-lg">{viewPerson.name}</div>
                  {viewPerson.nickname && <div className="text-xs text-gray-400">"{viewPerson.nickname}"</div>}
                  <div className="text-sm">{"⭐".repeat(viewPerson.sparkRating)}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>openEdit(viewPerson)} className="text-xs bg-rose-50 text-rose-400 font-semibold rounded-full px-3 py-1.5">Edit</button>
                <button onClick={()=>setViewPerson(null)} className="text-gray-300 text-xl leading-none">×</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[["📏 Height",viewPerson.height?`${viewPerson.height}cm`:"—"],["🎂 Birthday",viewPerson.birthday||"—"],["⭐ Zodiac",(()=>{const z=getZodiac(viewPerson.birthday||"");return z?`${z.emoji}${z.name}`:"—"})()],["🎂 Age",(()=>{const a=getAge(viewPerson.birthday||"");return a?`${a} yrs`:"—"})()],["💼 Job",viewPerson.occupation||"—"],["📱 Contact",viewPerson.contact||"—"]].map(([k,v])=>(
                <div key={k} className="bg-rose-50 rounded-xl p-3"><div className="text-xs text-gray-400">{k}</div><div className="font-semibold text-sm">{v}</div></div>
              ))}
            </div>
            {viewPerson.tags.length>0 && <div className="mb-3 flex flex-wrap gap-2">{viewPerson.tags.map(t=><span key={t} className="bg-rose-100 text-rose-500 text-xs rounded-full px-3 py-1">{t}</span>)}</div>}
            {viewPerson.notes && <div className="bg-rose-50 rounded-xl p-3 text-sm text-gray-500 mb-4">💬 {viewPerson.notes}</div>}
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-sm">📖 Stories</div>
              <button onClick={()=>{setStoryPersonId(viewPerson.id);setShowStoryForm(true);}} className="text-xs bg-rose-400 text-white rounded-full px-3 py-1">+ Add</button>
            </div>
            {stories.filter(s=>s.personId===viewPerson.id).map(s=>(
              <div key={s.id} className="bg-gray-50 rounded-xl p-3 mb-2 flex justify-between items-start">
                <div>
                  <div className="text-xs text-gray-400 mb-1">{s.date} {STORY_MOOD_EMOJI[s.moodTag]}</div>
                  <div className="text-sm">{s.content}</div>
                </div>
                <button onClick={()=>deleteStory(s.id)} className="text-gray-300 text-lg leading-none ml-2">×</button>
              </div>
            ))}
            {stories.filter(s=>s.personId===viewPerson.id).length===0 && <div className="text-xs text-gray-300 text-center py-2">No stories yet</div>}
            <button onClick={()=>deletePerson(viewPerson.id)} className="w-full mt-4 border border-rose-200 text-rose-400 rounded-xl py-2.5 text-sm">Delete profile</button>
          </div>
        </div>
      )}

      {showPersonForm && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50" onClick={()=>setShowPersonForm(false)}>
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="font-bold text-lg mb-4">{editPerson?"Edit Profile":"New Profile"} 💕</div>
            {[["Name *","name","text"],["Nickname","nickname","text"],["Height (cm)","height","number"],["Birthday","birthday","date"],["Occupation","occupation","text"],["Contact","contact","text"]].map(([l,k,t])=>(
              <div key={k} className="mb-3">
                <div className="text-xs text-gray-400 mb-1">{l}</div>
                <input type={t} value={(pForm as any)[k]} onChange={e=>setPForm(f=>({...f,[k]:e.target.value}))}
                  className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm outline-none" />
              </div>
            ))}
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-2">Color</div>
              <div className="flex gap-2">{COLORS.map(c=><div key={c} onClick={()=>setPForm(f=>({...f,color:c}))} className="w-7 h-7 rounded-full cursor-pointer" style={{background:c,border:pForm.color===c?"3px solid #333":"3px solid transparent"}}/>)}</div>
            </div>
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">{TAGS.map(t=><span key={t} onClick={()=>tagToggle(t)} className={`text-xs rounded-full px-3 py-1 cursor-pointer ${pForm.tags.includes(t)?"bg-rose-400 text-white":"bg-rose-50 text-rose-400"}`}>{t}</span>)}</div>
            </div>
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-2">Spark Rating</div>
              <div className="flex gap-1">{[1,2,3,4,5].map(n=><span key={n} onClick={()=>setPForm(f=>({...f,sparkRating:n}))} className={`text-2xl cursor-pointer ${pForm.sparkRating>=n?"opacity-100":"opacity-30"}`}>⭐</span>)}</div>
            </div>
            <div className="mb-5">
              <div className="text-xs text-gray-400 mb-1">Notes</div>
              <textarea value={pForm.notes} onChange={e=>setPForm(f=>({...f,notes:e.target.value}))} rows={3} className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm outline-none resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setShowPersonForm(false)} className="flex-1 border border-rose-200 rounded-xl py-2.5 text-sm text-gray-400">Cancel</button>
              <button onClick={savePerson} className="flex-[2] bg-rose-400 text-white rounded-xl py-2.5 text-sm font-bold">Save 💾</button>
            </div>
          </div>
        </div>
      )}

      {showDateForm && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50" onClick={()=>setShowDateForm(false)}>
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="font-bold text-lg mb-4">Log a Date 📅</div>
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-1">Person *</div>
              <select value={dForm.personId} onChange={e=>setDForm(f=>({...f,personId:e.target.value}))} className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                <option value="">Select...</option>
                {people.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            {[["Date *","date","date"],["Time","time","time"],["Location","location","text"],["Notes","notes","text"]].map(([l,k,t])=>(
              <div key={k} className="mb-3">
                <div className="text-xs text-gray-400 mb-1">{l}</div>
                <input type={t} value={(dForm as any)[k]} onChange={e=>setDForm(f=>({...f,[k]:e.target.value}))} className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm outline-none" />
              </div>
            ))}
            <div className="mb-5">
              <div className="text-xs text-gray-400 mb-2">Mood</div>
              <div className="flex gap-3">{["loved","good","neutral","awkward","bad"].map((m,i)=><span key={m} onClick={()=>setDForm(f=>({...f,mood:f.mood===m?"":m}))} className={`text-2xl cursor-pointer ${dForm.mood===m?"opacity-100":"opacity-30"}`}>{MOODS[i]}</span>)}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setShowDateForm(false)} className="flex-1 border border-rose-200 rounded-xl py-2.5 text-sm text-gray-400">Cancel</button>
              <button onClick={saveDate} className="flex-[2] bg-rose-400 text-white rounded-xl py-2.5 text-sm font-bold">Save 💾</button>
            </div>
          </div>
        </div>
      )}

      {showStoryForm && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50" onClick={()=>setShowStoryForm(false)}>
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-6" onClick={e=>e.stopPropagation()}>
            <div className="font-bold text-lg mb-4">Add Story 📖</div>
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-1">Date</div>
              <input type="date" value={sForm.date} onChange={e=>setSForm(f=>({...f,date:e.target.value}))} className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm outline-none" />
            </div>
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-2">Mood</div>
              <div className="flex gap-2">{STORY_MOODS.map(m=><span key={m} onClick={()=>setSForm(f=>({...f,moodTag:m}))} className={`text-xl cursor-pointer ${sForm.moodTag===m?"opacity-100":"opacity-30"}`}>{STORY_MOOD_EMOJI[m]}</span>)}</div>
            </div>
            <div className="mb-5">
              <div className="text-xs text-gray-400 mb-1">Story *</div>
              <textarea value={sForm.content} onChange={e=>setSForm(f=>({...f,content:e.target.value}))} rows={4} placeholder="What happened..." className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm outline-none resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setShowStoryForm(false)} className="flex-1 border border-rose-200 rounded-xl py-2.5 text-sm text-gray-400">Cancel</button>
              <button onClick={saveStory} className="flex-[2] bg-rose-400 text-white rounded-xl py-2.5 text-sm font-bold">Save 💾</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}