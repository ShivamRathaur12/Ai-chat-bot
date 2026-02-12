let prompt=document.querySelector("#prompt");
let chatContainer=document.querySelector(".chatcontainer");
let btn1=document.querySelector("#image");
let image=document.querySelector("#image img");
let btn2=document.querySelector("#submit");
let imageInput=document.querySelector("#image input")
const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=AIzaSyAwiobZzqr0XB8SCt9WivgdbCWvOFBJxI8";
let user={
    message:null,
    file:{
        mime_type: null,
            data: null
    }
}

async function generateResponse(aiChatBox) {
   let text=aiChatBox.querySelector(".ai-chat-area");
    let RequestOption={
    method:"POST",
    headers:{'Content-Type': 'application/json'},
    body:JSON.stringify({
    "contents": [
      {
        "parts": [
          {
            "text": user.message
          },
          (user.file.data?[{"inline_data":user.file}]:[])
        ]
      }
    ]
  }
)
   }
   try{
      let response=await fetch(Api_Url,RequestOption);
      let data=await response.json();
      let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
      text.innerHTML=apiResponse;
      
   }
   catch(err){
console.log(err);

   }
   finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
        image.src="image.svg";  
    image.classList.remove("choose");
    user.file={};
   }
    
}


function createChatBox(html,classes){
    let div=document.createElement("div");
    div.innerHTML=html;
    div.classList.add(classes);
    return div;
}




function handlechatResponse(usermessage){
    user.message=usermessage;
    let html=`<div class="user-chat-box">
        <img src="user.png" alt="" id="userImage" width="8%">
        <div class="user-chat-area">
        ${user.message}
        ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>` : ""}
        </div>`
        prompt.value="";
        let userChatBox=createChatBox(html,"user-chat-box");
        chatContainer.appendChild(userChatBox);
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        setTimeout(()=>{
        let html1=`<img src="ai.png" alt="" id="Ai-img" width="5%">
    <div class="ai-chat-area">
        <img src="loading.gif" alt="" class="load" width="5%"> 
    </div> `
    let aiChatBox=createChatBox(html1,"ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
        },600)
}
prompt.addEventListener("keydown",(e)=>{
if(e.key=="Enter"){
    handlechatResponse(prompt.value);
   
}
})
btn2.addEventListener("click",()=>{
handlechatResponse(prompt.value);
})

imageInput.addEventListener("change",()=>{
    const file=imageInput.files[0];
    if(!file) return;
    let reader=new FileReader();
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1];
        user.file={
        mime_type: file.type,
            data: base64string
    }
    image.src=`data:${user.file.mime_type};base64,${user.file.data}`;  
    image.classList.add("choose");
}

    reader.readAsDataURL(file);
})
btn1.addEventListener("click",()=>{
    btn1.querySelector("input").click()
})
