(function(){"use strict";var e={6743:function(e,n,t){var o=t(9242),s=t(1020),a=t(3396),l=t(7139);const r={class:"navbar navbar-expand-md bg-body-tertiary"},i={class:"container-fluid"},u=(0,a._)("a",{class:"navbar-brand"},"FundMosque",-1),d=(0,a._)("span",{class:"navbar-toggler-icon"},null,-1),c=[d],m={class:"navbar-nav mx-auto"};function h(e,n,t,o,s,d){const h=(0,a.up)("router-link"),p=(0,a.up)("router-view");return(0,a.wg)(),(0,a.iD)(a.HY,null,[(0,a._)("nav",r,[(0,a._)("div",i,[u,(0,a._)("button",{class:"navbar-toggler",type:"button","data-bs-toggle":"collapse","data-bs-target":"#navbarSupportedContent","aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation",onClick:n[0]||(n[0]=(...e)=>o.toggleNavbar&&o.toggleNavbar(...e))},c),(0,a._)("div",{class:(0,l.C_)(["collapse navbar-collapse",{show:o.isNavbarOpen}]),id:"navbarSupportedContent"},[(0,a._)("div",m,[(0,a.Wm)(h,{onClick:o.closeNavbar,to:"/",class:"nav-item nav-link"},{default:(0,a.w5)((()=>[(0,a.Uk)("Home")])),_:1},8,["onClick"]),o.user.isLoggedIn?((0,a.wg)(),(0,a.j4)(h,{key:0,onClick:o.closeNavbar,class:"nav-item nav-link",to:"/makeDonation"},{default:(0,a.w5)((()=>[(0,a.Uk)("Make a Donation")])),_:1},8,["onClick"])):(0,a.kq)("",!0),o.user.isLoggedIn?((0,a.wg)(),(0,a.j4)(h,{key:1,onClick:o.closeNavbar,class:"nav-item nav-link",to:"/profile"},{default:(0,a.w5)((()=>[(0,a.Uk)("View Profile")])),_:1},8,["onClick"])):(0,a.kq)("",!0),o.user.isLoggedIn?((0,a.wg)(),(0,a.j4)(h,{key:2,onClick:o.closeNavbar,class:"nav-item nav-link",to:"/mosquesInfo"},{default:(0,a.w5)((()=>[(0,a.Uk)("View Mosques")])),_:1},8,["onClick"])):(0,a.kq)("",!0),o.user.isLoggedIn?((0,a.wg)(),(0,a.j4)(h,{key:3,onClick:o.closeNavbar,class:"nav-item nav-link",to:"/campaigns"},{default:(0,a.w5)((()=>[(0,a.Uk)("View Campaigns")])),_:1},8,["onClick"])):(0,a.kq)("",!0),o.user.isLoggedIn&&o.user.isAdmin?((0,a.wg)(),(0,a.j4)(h,{key:4,onClick:o.closeNavbar,class:"nav-item nav-link",to:"/adminDashboard"},{default:(0,a.w5)((()=>[(0,a.Uk)("Admin Dashboard")])),_:1},8,["onClick"])):(0,a.kq)("",!0),o.user.isLoggedIn?(0,a.kq)("",!0):((0,a.wg)(),(0,a.j4)(h,{key:5,class:"nav-item nav-link",to:"/register",onClick:o.closeNavbar},{default:(0,a.w5)((()=>[(0,a.Uk)("Register")])),_:1},8,["onClick"])),o.user.isLoggedIn?(0,a.kq)("",!0):((0,a.wg)(),(0,a.j4)(h,{key:6,class:"nav-item nav-link",to:"login",onClick:o.closeNavbar},{default:(0,a.w5)((()=>[(0,a.Uk)("Login")])),_:1},8,["onClick"]))]),(0,a._)("button",{class:"btn btn-secondary",id:"darkModeButton",onClick:n[1]||(n[1]=(...e)=>o.toggleTheme&&o.toggleTheme(...e))},(0,l.zw)("dark"===o.theme?"Light Mode":"Dark Mode"),1)],2)])]),(0,a.Wm)(p)],64)}var p=t(4870),g=(t(560),t(2483));const _=(0,a._)("p",null,[(0,a.Uk)("Fill in the form below to make a donation "),(0,a._)("br"),(0,a.Uk)(" We thank you for your generosity! "),(0,a._)("br"),(0,a.Uk)("To change the mosque you wish to donate to, edit your profle.")],-1),b={class:"mb-3"},f=(0,a._)("label",{for:"amount"},"Amount",-1),w={class:"mb-3"},v=(0,a._)("label",{for:"campaign"},"Campaign",-1),y=(0,a._)("option",{value:"",selected:""},"None",-1),k=["value"],q=(0,a._)("button",{type:"submit",class:"btn btn-primary"},"Submit",-1);function D(e,n,t,s,r,i){return(0,a.wg)(),(0,a.iD)(a.HY,null,[(0,a._)("h1",null,"Donate to "+(0,l.zw)(r.chosenMosqueName),1),_,(0,a._)("form",{onSubmit:n[2]||(n[2]=(0,o.iM)(((...e)=>i.submitDonation&&i.submitDonation(...e)),["prevent"]))},[(0,a._)("div",b,[f,(0,a.wy)((0,a._)("input",{type:"number",class:"form-control",id:"amount","aria-describedby":"amount","onUpdate:modelValue":n[0]||(n[0]=e=>r.amount=e),placeholder:"Enter Amount in £ here"},null,512),[[o.nr,r.amount]])]),(0,a._)("div",w,[v,(0,a.wy)((0,a._)("select",{class:"form-select",id:"campaign",name:"campaign","onUpdate:modelValue":n[1]||(n[1]=e=>r.selectedCampaign=e)},[y,((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(r.campaigns,(e=>((0,a.wg)(),(0,a.iD)("option",{key:e._id,value:e._id},(0,l.zw)(e.name),9,k)))),128))],512),[[o.bM,r.selectedCampaign]])]),q],32)],64)}var M={name:"DonationForm",setup(){const e=pt();return{user:e}},data(){return{amount:"",donor:"",mosque:"",users:[],campaigns:[],selectedCampaign:null,chosenMosqueName:""}},created(){fetch(`/api/campaigns/${this.user.chosenMosque}`).then((e=>{if(e.ok)return e.json();throw new Error(e.status)})).then((e=>this.campaigns=e)).catch((()=>console.log("Error"))),fetch("/api/users").then((e=>{if(e.ok)return e.json();throw new Error(e.status)})).then((e=>{this.users=e})).catch((e=>{console.error(e)})),fetch(`/api/mosques/${this.user.chosenMosque}`).then((e=>{if(e.ok)return e.json();throw new Error(e.status)})).then((e=>{this.chosenMosqueName=e.name})).catch((e=>{console.error(e)}))},methods:{submitDonation(){let e=[];e=""===this.selectedCampaign?{amount:this.amount,donor:this.user._id,mosque:this.user.chosenMosque}:{amount:this.amount,donor:this.user._id,mosque:this.user.chosenMosque,campaign:this.selectedCampaign},console.log(e),fetch("/api/donations",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json;charset=UTF-8"},body:JSON.stringify(e)}).then((e=>{if(e.ok)return e.json();throw new Error(e.status)})).then((()=>{alert("Donation successful"),mt.push("/")})).catch((e=>{console.error(e),alert("Donation failed")}))}}},C=t(89);const U=(0,C.Z)(M,[["render",D]]);var I=U;const j={class:"home"},S=(0,a._)("h1",null,"Welcome to FundMosque!",-1),z={key:0},L={class:"logout"},N={key:0},A={key:0};function E(e,n,t,o,s,r){const i=(0,a.up)("DonationList");return(0,a.wg)(),(0,a.iD)(a.HY,null,[(0,a._)("div",j,[S,o.user.isLoggedIn?(0,a.kq)("",!0):((0,a.wg)(),(0,a.iD)("p",z,"Please sign up or log in to continue."))]),(0,a._)("div",null,[(0,a._)("div",L,[o.user.isLoggedIn?((0,a.wg)(),(0,a.iD)("p",N,"You are logged in as "+(0,l.zw)(o.user.username),1)):(0,a.kq)("",!0),o.user.isLoggedIn?((0,a.wg)(),(0,a.iD)("button",{key:1,class:"btn btn-primary",onClick:n[0]||(n[0]=(...e)=>o.user.logout&&o.user.logout(...e))},"Log Out")):(0,a.kq)("",!0)])]),o.user.isLoggedIn?((0,a.wg)(),(0,a.iD)("div",A,[(0,a.Wm)(i)])):(0,a.kq)("",!0)],64)}const O=e=>((0,a.dD)("data-v-7bff4c92"),e=e(),(0,a.Cn)(),e),x={class:"donation-list"},P=O((()=>(0,a._)("h1",null,"Recent Donations",-1))),H={class:"table"},T=O((()=>(0,a._)("thead",null,[(0,a._)("tr",null,[(0,a._)("th",null,"Amount"),(0,a._)("th",null,"Donor"),(0,a._)("th",null,"Mosque")])],-1)));function Y(e,n,t,o,s,r){return(0,a.wg)(),(0,a.iD)("div",x,[P,(0,a._)("table",H,[T,(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(s.donations,(e=>((0,a.wg)(),(0,a.iD)("tr",{key:e._id},[(0,a._)("td",null,(0,l.zw)(e.amount),1),(0,a._)("td",null,(0,l.zw)(e.donor.name),1),(0,a._)("td",null,(0,l.zw)(e.mosque.name),1)])))),128))])])])}var V={name:"DonationList",data(){return{donations:[]}},created(){fetch("/api/donations").then((e=>{if(e.ok)return e.json();throw new Error(e.status)})).then((e=>{this.donations=e,this.donations.reverse(),this.donations=this.donations.slice(0,3)})).catch((e=>{console.error(e)}))}};const F=(0,C.Z)(V,[["render",Y],["__scopeId","data-v-7bff4c92"]]);var $=F,Z={name:"HomePage",components:{DonationList:$},setup(){const e=pt();return{user:e}}};const K=(0,C.Z)(Z,[["render",E]]);var J=K;const W=(0,a._)("h1",null,"Register",-1),R={class:"mb-3"},B=(0,a._)("label",{for:"username",class:"form-label"},"Username",-1),G={class:"mb-3"},Q=(0,a._)("label",{for:"name",class:"form-label"},"Full Name",-1),X={class:"mb-3"},ee=(0,a._)("label",{for:"email",class:"form-label"},"Email address",-1),ne={class:"mb-3"},te=(0,a._)("label",{for:"password",class:"form-label"},"Password",-1),oe={class:"mb-3"},se=(0,a._)("label",{for:"chosenMosque"},"Choose your preferred Mosque",-1),ae=(0,a._)("option",{value:"",disabled:"",selected:""}," Click here to select a mosque ",-1),le=["value"],re={class:"mb-3"},ie=(0,a._)("label",{for:"isAdmin",class:"form-label"},"Are you an admin?",-1),ue={key:0,class:"mb-3"},de=(0,a._)("label",{for:"adminPasscode",class:"form-label"},"Admin Passcode",-1),ce=(0,a._)("button",{class:"btn btn-primary",type:"submit"},"Register",-1);function me(e,n,t,s,r,i){return(0,a.wg)(),(0,a.iD)(a.HY,null,[W,(0,a._)("form",{onSubmit:n[7]||(n[7]=(0,o.iM)(((...e)=>i.register&&i.register(...e)),["prevent"])),class:"register-form"},[(0,a._)("div",R,[B,(0,a.wy)((0,a._)("input",{class:"form-control","onUpdate:modelValue":n[0]||(n[0]=e=>r.username=e),type:"text",required:""},null,512),[[o.nr,r.username]])]),(0,a._)("div",G,[Q,(0,a.wy)((0,a._)("input",{class:"form-control","onUpdate:modelValue":n[1]||(n[1]=e=>r.name=e),type:"text",required:""},null,512),[[o.nr,r.name]])]),(0,a._)("div",X,[ee,(0,a.wy)((0,a._)("input",{class:"form-control","onUpdate:modelValue":n[2]||(n[2]=e=>r.email=e),type:"email",required:""},null,512),[[o.nr,r.email]])]),(0,a._)("div",ne,[te,(0,a.wy)((0,a._)("input",{class:"form-control","onUpdate:modelValue":n[3]||(n[3]=e=>r.password=e),type:"password",required:""},null,512),[[o.nr,r.password]])]),(0,a._)("div",oe,[se,(0,a.wy)((0,a._)("select",{id:"chosenMosque",name:"chosenMosque","onUpdate:modelValue":n[4]||(n[4]=e=>r.chosenMosque=e),class:"form-control",required:""},[ae,((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(r.mosques,(e=>((0,a.wg)(),(0,a.iD)("option",{key:e._id,value:e._id},(0,l.zw)(e.name),9,le)))),128))],512),[[o.bM,r.chosenMosque]])]),(0,a._)("div",re,[ie,(0,a.wy)((0,a._)("input",{type:"checkbox","onUpdate:modelValue":n[5]||(n[5]=e=>r.isAdmin=e)},null,512),[[o.e8,r.isAdmin]])]),r.isAdmin?((0,a.wg)(),(0,a.iD)("div",ue,[de,(0,a.wy)((0,a._)("input",{class:"form-control","onUpdate:modelValue":n[6]||(n[6]=e=>r.adminPasscode=e),type:"password",required:""},null,512),[[o.nr,r.adminPasscode]])])):(0,a.kq)("",!0),ce],32)],64)}var he={data(){return{username:"",name:"",email:"",password:"",isAdmin:!1,adminPasscode:"",chosenMosque:"",mosques:[]}},created(){fetch("/api/mosques").then((e=>{if(e.ok)return e.json();throw new Error(e.status)})).then((e=>{this.mosques=e})).catch((e=>{console.error(e)}))},methods:{async register(){const e=pt();let n={username:this.username,name:this.name,email:this.email,password:this.password,isAdmin:this.isAdmin,adminPasscode:this.adminPasscode,chosenMosque:this.chosenMosque};console.log(n);try{const t=await fetch("/api/register",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}),o=await t.json();o.success?(await e.loggedIn(),mt.push("/"),alert("Registration successful")):alert("uh oh, try again!")}catch(t){console.log(t),alert("Registration failed")}}}};const pe=(0,C.Z)(he,[["render",me]]);var ge=pe;const _e={class:"login"},be=(0,a._)("h1",null,"Login",-1),fe={class:"mb-3"},we=(0,a._)("label",{class:"form-label",for:"username"},"Username",-1),ve={class:"mb-3"},ye=(0,a._)("label",{class:"form-label",for:"password"},"Password",-1),ke=(0,a._)("button",{class:"btn btn-primary",type:"submit"},"Login",-1);function qe(e,n,t,s,l,r){return(0,a.wg)(),(0,a.iD)("div",_e,[be,(0,a._)("form",{onSubmit:n[2]||(n[2]=(0,o.iM)(((...e)=>r.login&&r.login(...e)),["prevent"])),class:"login-form"},[(0,a._)("div",fe,[we,(0,a.wy)((0,a._)("input",{id:"username",class:"form-control",type:"text","onUpdate:modelValue":n[0]||(n[0]=e=>s.userStore.username=e),required:""},null,512),[[o.nr,s.userStore.username]])]),(0,a._)("div",ve,[ye,(0,a.wy)((0,a._)("input",{id:"password",class:"form-control",type:"password","onUpdate:modelValue":n[1]||(n[1]=e=>s.userStore.password=e),required:""},null,512),[[o.nr,s.userStore.password]])]),ke],32)])}var De={name:"LoginPage",setup(){const e=pt();return{userStore:e}},methods:{login(){this.userStore.login(),this.userStore.username="",this.userStore.password=""}}};const Me=(0,C.Z)(De,[["render",qe]]);var Ce=Me;const Ue=(0,a._)("h1",null,"Profile",-1),Ie=(0,a._)("p",null,[(0,a.Uk)(" Below are the details stored by FundMosque for this account. "),(0,a._)("br"),(0,a.Uk)(" Click the update button to update your details ")],-1),je=(0,a._)("button",{class:"btn btn-primary","data-bs-toggle":"modal","data-bs-target":"#exampleModal"}," Update ",-1),Se={class:"donation-table"},ze={class:"table"},Le=(0,a._)("thead",null,[(0,a._)("tr",null,[(0,a._)("th",null,"Amount"),(0,a._)("th",null,"Mosque")])],-1),Ne={class:"modal fade",id:"exampleModal",tabindex:"-1","aria-labelledby":"exampleModalLabel","aria-hidden":"true"},Ae={class:"modal-dialog"},Ee={class:"modal-content"},Oe=(0,a._)("div",{class:"modal-header"},[(0,a._)("h1",{class:"modal-title fs-5",id:"exampleModalLabel"}," Update user info here "),(0,a._)("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1),xe={class:"modal-body"},Pe={class:"mb-3"},He=(0,a._)("label",{for:"username",class:"form-label"},"Username (cannot be changed)",-1),Te={class:"mb-3"},Ye=(0,a._)("label",{for:"name",class:"form-label"},"Full Name",-1),Ve={class:"mb-3"},Fe=(0,a._)("label",{for:"email",class:"form-label"},"Email address",-1),$e={class:"mb-3"},Ze=(0,a._)("label",{for:"chosenMosque"},"Choose your preferred Mosque",-1),Ke=(0,a._)("option",{value:"",disabled:"",selected:""}," Click here to select a mosque ",-1),Je=["value"],We=(0,a._)("button",{class:"btn btn-primary",type:"submit","data-bs-dismiss":"modal"}," Update ",-1);function Re(e,n,t,s,r,i){return(0,a.wg)(),(0,a.iD)(a.HY,null,[Ue,Ie,(0,a._)("h3",null,"Name: "+(0,l.zw)(s.user.name),1),(0,a._)("h3",null,"Username: "+(0,l.zw)(s.user.username),1),(0,a._)("h3",null,"Email: "+(0,l.zw)(s.user.email),1),(0,a._)("h3",null,"Chosen Mosque: "+(0,l.zw)(r.chosenMosqueName),1),je,(0,a._)("div",Se,[(0,a._)("table",ze,[Le,(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(r.donations,(e=>((0,a.wg)(),(0,a.iD)("tr",{key:e._id},[(0,a._)("td",null,(0,l.zw)(e.amount),1),(0,a._)("td",null,(0,l.zw)(e.mosque.name),1)])))),128))])])]),(0,a._)("div",Ne,[(0,a._)("div",Ae,[(0,a._)("div",Ee,[Oe,(0,a._)("div",xe,[(0,a._)("form",{onSubmit:n[4]||(n[4]=(0,o.iM)((e=>i.update(s.user._id)),["prevent"])),class:"register-form"},[(0,a._)("div",Pe,[He,(0,a.wy)((0,a._)("input",{class:"form-control","onUpdate:modelValue":n[0]||(n[0]=e=>s.user.username=e),type:"text",disabled:"",required:""},null,512),[[o.nr,s.user.username]])]),(0,a._)("div",Te,[Ye,(0,a.wy)((0,a._)("input",{class:"form-control","onUpdate:modelValue":n[1]||(n[1]=e=>s.user.name=e),type:"text",required:""},null,512),[[o.nr,s.user.name]])]),(0,a._)("div",Ve,[Fe,(0,a.wy)((0,a._)("input",{class:"form-control","onUpdate:modelValue":n[2]||(n[2]=e=>s.user.email=e),type:"email",required:""},null,512),[[o.nr,s.user.email]])]),(0,a._)("div",$e,[Ze,(0,a.wy)((0,a._)("select",{id:"chosenMosque",name:"chosenMosque","onUpdate:modelValue":n[3]||(n[3]=e=>s.user.chosenMosque=e),class:"form-control",required:""},[Ke,((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(e.mosques,(e=>((0,a.wg)(),(0,a.iD)("option",{key:e._id,value:e._id},(0,l.zw)(e.name),9,Je)))),128))],512),[[o.bM,s.user.chosenMosque]])]),We],32)])])])])],64)}var Be={name:"ProfilePage",setup(){const e=pt();return{user:e}},data(){return{donations:[],chosenMosqueName:""}},created(){fetch("/api/mosques").then((e=>{if(e.ok)return e.json();throw new Error(e.status)})).then((e=>{this.mosques=e})).catch((e=>{console.error(e)})),fetch(`/api/userDonations/${this.user._id}`).then((e=>{if(e.ok)return e.json()})).then((e=>{this.donations=e})),fetch(`/api/mosques/${this.user.chosenMosque}`).then((e=>{if(e.ok)return e.json();throw e})).then((e=>{this.chosenMosqueName=e.name}))},methods:{async update(e){fetch(`/api/users/${e}`,{method:"PUT",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.user)}).then((e=>{if(!e.ok)throw e;return e.json()})).then((e=>{if(!e.success)throw new Error(e.message||"Failed to update user");alert("User updated successfully!"),this.$router.push("/")})).catch((e=>{alert(`uh oh, theres a problem\n${e.status}: ${e.statusText}`)}))}}};const Ge=(0,C.Z)(Be,[["render",Re]]);var Qe=Ge;const Xe={class:"mosque-list"},en=(0,a._)("h1",null,"Mosques",-1),nn=(0,a._)("p",null,[(0,a.Uk)(" Below are the mosques registered with FundMosque."),(0,a._)("br"),(0,a.Uk)(" Click More Info to find out more ")],-1),tn={class:"table"},on=(0,a._)("thead",null,[(0,a._)("tr",null,[(0,a._)("th",null,"Mosque Name"),(0,a._)("th",null,"Mosque Address"),(0,a._)("th",null,"Action")])],-1),sn=["onClick"],an={class:"modal fade",id:"exampleModal",tabindex:"-1","aria-labelledby":"exampleModalLabel","aria-hidden":"true"},ln={class:"modal-dialog modal-dialog-scrollable"},rn={class:"modal-content"},un=(0,a._)("div",{class:"modal-header"},[(0,a._)("h1",{class:"modal-title fs-5",id:"exampleModalLabel"},"More information about: "),(0,a._)("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1),dn={class:"modal-body"},cn={class:"table"},mn=(0,a._)("thead",null,[(0,a._)("tr",null,[(0,a._)("th",null,"Amount"),(0,a._)("th",null,"Donor")])],-1),hn=(0,a._)("div",{class:"modal-footer"},[(0,a._)("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"}," Close ")],-1);function pn(e,n,t,o,s,r){return(0,a.wg)(),(0,a.iD)(a.HY,null,[(0,a._)("div",Xe,[en,nn,(0,a._)("table",tn,[on,(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(s.mosques,(e=>((0,a.wg)(),(0,a.iD)("tr",{key:e._id},[(0,a._)("td",null,(0,l.zw)(e.name),1),(0,a._)("td",null,(0,l.zw)(e.address),1),(0,a._)("td",null,[(0,a._)("button",{class:"btn btn-primary","data-bs-toggle":"modal","data-bs-target":"#exampleModal",onClick:n=>r.mosqueMoreInfo(e._id,e.name)}," More Info ",8,sn)])])))),128))])])]),(0,a._)("div",an,[(0,a._)("div",ln,[(0,a._)("div",rn,[un,(0,a._)("div",dn,[(0,a._)("h2",null,(0,l.zw)(this.selectedMosque),1),(0,a._)("p",null,"The total donations since joining FundMosque for "+(0,l.zw)(s.selectedMosque)+" is: £"+(0,l.zw)(s.totalMosqueDonations)+"!",1),(0,a._)("table",cn,[mn,(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(s.mosqueDonations,(e=>((0,a.wg)(),(0,a.iD)("tr",{key:e._id},[(0,a._)("td",null,(0,l.zw)(e.amount),1),(0,a._)("td",null,(0,l.zw)(e.donor.name),1)])))),128))])])]),hn])])])],64)}var gn={name:"MosquesPage",data(){return{mosques:[],selectedMosque:"",mosqueDonations:[],totalMosqueDonations:0}},mounted(){fetch("/api/mosques/").then((e=>{if(e.ok)return e.json();throw new Error(e.status)})).then((e=>{this.mosques=e})).catch((e=>{console.error(e)}))},methods:{mosqueMoreInfo(e,n){this.selectedMosque=n,fetch(`/api/mosqueAllDonations/${e}`).then((e=>{if(e.ok)return e.json();throw new Error(e.status)})).then((e=>{this.mosqueDonations=e,this.totalMosqueDonations=0;for(let n=0;n<this.mosqueDonations.length;n++)this.totalMosqueDonations+=this.mosqueDonations[n].amount})).catch((e=>{console.error(e)}))}}};const _n=(0,C.Z)(gn,[["render",pn]]);var bn=_n;const fn={class:"users-table"},wn=(0,a._)("h1",null,"Admin Dashboard",-1),vn=(0,a._)("h2",null,"Users",-1),yn={class:"table-responsive"},kn={class:"table"},qn=(0,a._)("thead",null,[(0,a._)("tr",null,[(0,a._)("th",null,"ID"),(0,a._)("th",null,"Username"),(0,a._)("th",null,"Full Name"),(0,a._)("th",null,"Email")])],-1),Dn=(0,a._)("h2",null,"Mosques",-1),Mn={class:"table-responsive"},Cn={class:"table"},Un=(0,a._)("thead",null,[(0,a._)("tr",null,[(0,a._)("th",null,"ID"),(0,a._)("th",null,"Name"),(0,a._)("th",null,"Address"),(0,a._)("th",null,"Contact")])],-1),In=(0,a._)("h2",null,"Donations",-1),jn={class:"table-responsive"},Sn={class:"table"},zn=(0,a._)("thead",null,[(0,a._)("tr",null,[(0,a._)("th",null,"ID"),(0,a._)("th",null,"Amount"),(0,a._)("th",null,"Donor Name"),(0,a._)("th",null,"Mosque")])],-1);function Ln(e,n,t,o,s,r){return(0,a.wg)(),(0,a.iD)("div",fn,[wn,vn,(0,a._)("div",yn,[(0,a._)("table",kn,[qn,(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(s.users,(e=>((0,a.wg)(),(0,a.iD)("tr",{key:e._id},[(0,a._)("td",null,(0,l.zw)(e._id),1),(0,a._)("td",null,(0,l.zw)(e.username),1),(0,a._)("td",null,(0,l.zw)(e.name),1),(0,a._)("td",null,(0,l.zw)(e.email),1)])))),128))])])]),Dn,(0,a._)("div",Mn,[(0,a._)("table",Cn,[Un,(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(s.mosques,(e=>((0,a.wg)(),(0,a.iD)("tr",{key:e._id},[(0,a._)("td",null,(0,l.zw)(e._id),1),(0,a._)("td",null,(0,l.zw)(e.name),1),(0,a._)("td",null,(0,l.zw)(e.address),1),(0,a._)("td",null,(0,l.zw)(e.contact),1)])))),128))])])]),In,(0,a._)("div",jn,[(0,a._)("table",Sn,[zn,(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(s.donations,(e=>((0,a.wg)(),(0,a.iD)("tr",{key:e._id},[(0,a._)("td",null,(0,l.zw)(e._id),1),(0,a._)("td",null,(0,l.zw)(e.amount),1),(0,a._)("td",null,(0,l.zw)(e.donor.name),1),(0,a._)("td",null,(0,l.zw)(e.mosque.name),1)])))),128))])])])])}var Nn={name:"AdminDashboard",data(){return{users:[],mosques:[],donations:[]}},created(){fetch("/api/users").then((e=>{if(e.ok)return e.json();throw new Error(e.status)})).then((e=>{this.users=e})).catch((e=>{console.error(e)})),fetch("/api/mosques").then((e=>{if(e.ok)return e.json();throw new Error(e.status)})).then((e=>{this.mosques=e})).catch((e=>{console.error(e)})),fetch("/api/donations").then((e=>{if(e.ok)return e.json();throw new Error(e.status)})).then((e=>{this.donations=e})).catch((e=>{console.error(e)}))}};const An=(0,C.Z)(Nn,[["render",Ln]]);var En=An;const On=e=>((0,a.dD)("data-v-f2ba3a76"),e=e(),(0,a.Cn)(),e),xn={class:"campaign-list"},Pn={class:"card-body"},Hn={class:"card-title"},Tn={class:"card-text"},Yn={class:"card-text status"},Vn=On((()=>(0,a._)("br",null,null,-1))),Fn=On((()=>(0,a._)("br",null,null,-1))),$n=On((()=>(0,a._)("br",null,null,-1))),Zn=On((()=>(0,a._)("a",{href:"#",class:"btn btn-primary"},"Donate",-1)));function Kn(e,n,t,o,s,r){return(0,a.wg)(),(0,a.iD)("div",xn,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(s.campaignList,(e=>((0,a.wg)(),(0,a.iD)("div",{class:"card",key:e._id},[(0,a._)("div",Pn,[(0,a._)("h5",Hn,(0,l.zw)(e.name),1),(0,a._)("p",Tn,(0,l.zw)(e.description),1),(0,a._)("p",Yn,[(0,a.Uk)(" Goal: "+(0,l.zw)(e.goal)+" ",1),Vn,(0,a.Uk)(" Raised: "+(0,l.zw)(e.raisedAmount)+" ",1),Fn,(0,a.Uk)(" Start Date: "+(0,l.zw)(r.formatDate(e.startDate))+" ",1),$n,(0,a.Uk)(" End Date: "+(0,l.zw)(r.formatDate(e.endDate)),1)]),Zn])])))),128))])}var Jn={setup(){const e=pt();return{user:e}},data(){return{chosenMosqueName:"",campaignList:[]}},created(){fetch(`/api/mosques/${this.user.chosenMosque}`).then((e=>{if(e.ok)return e.json();throw e})).then((e=>{this.chosenMosqueName=e.name})),fetch(`/api/campaigns/${this.user.chosenMosque}`).then((function(e){return e.json()})).then(function(e){this.campaignList=e}.bind(this))},methods:{formatDate(e){return new Date(e).toLocaleDateString()}}};const Wn=(0,C.Z)(Jn,[["render",Kn],["__scopeId","data-v-f2ba3a76"]]);var Rn=Wn;const Bn=(0,a._)("h1",null,"Uh Oh",-1),Gn=(0,a._)("h2",null,"Looks like that page doesn't exist!",-1),Qn=(0,a._)("p",null,"Navigate back to home to try again",-1);function Xn(e,n){return(0,a.wg)(),(0,a.iD)(a.HY,null,[Bn,Gn,Qn],64)}const et={},nt=(0,C.Z)(et,[["render",Xn]]);var tt=nt;const ot=(0,a._)("h1",null,"Woops!",-1),st=(0,a._)("h2",null,"Looks like you don't have permission to access that page!",-1),at=(0,a._)("p",null,"Navigate back to home to try again",-1);function lt(e,n){return(0,a.wg)(),(0,a.iD)(a.HY,null,[ot,st,at],64)}const rt={},it=(0,C.Z)(rt,[["render",lt]]);var ut=it;const dt=[{path:"/",name:"home",component:J},{path:"/makeDonation",name:"donationForm",component:I,beforeEnter:(e,n,t)=>{const o=pt();o.isLoggedIn?t():t({name:"denied"})}},{path:"/profile",name:"profile",component:Qe,beforeEnter:(e,n,t)=>{const o=pt();o.isLoggedIn?t():t({name:"denied"})}},{path:"/mosquesInfo",name:"mosquesInfo",component:bn,beforeEnter:(e,n,t)=>{const o=pt();o.isLoggedIn?t():t({name:"denied"})}},{path:"/campaigns",name:"campaigns",component:Rn,beforeEnter:(e,n,t)=>{const o=pt();o.isLoggedIn?t():t({name:"denied"})}},{path:"/adminDashboard",name:"adminDashboard",component:En,beforeEnter:(e,n,t)=>{const o=pt();o.isAdmin?t():t({name:"denied"})}},{path:"/register",name:"register",component:ge,beforeEnter:(e,n,t)=>{const o=pt();o.isLoggedIn?t({name:"home"}):t()}},{path:"/login",name:"login",component:Ce,beforeEnter:(e,n,t)=>{const o=pt();o.isLoggedIn?t({name:"home"}):t()}},{path:"/denied",name:"denied",component:ut},{path:"/:catchAll(.*)",component:tt}],ct=(0,g.p7)({history:(0,g.PO)("/"),routes:dt});var mt=ct;const ht={_id:0,username:"",name:"",email:"",password:"",isAdmin:!1,chosenMosque:"",isLoggedIn:!1},pt=(0,s.Q_)("user",{state:()=>{const e=localStorage.getItem("user");return e?JSON.parse(e):ht},actions:{async loggedIn(){try{const e=await fetch("/api/loggedIn",{method:"GET",credentials:"include"}),n=await e.json();n.success?(this._id=n._id,this.isLoggedIn=!0,this.username=n.username,this.name=n.name,this.email=n.email,this.isAdmin=n.isAdmin,this.chosenMosque=n.chosenMosque,localStorage.setItem("user",JSON.stringify(this.$state))):(this.isLoggedIn=!1,localStorage.removeItem("user"))}catch(e){console.log(e)}},async logout(){const e=await fetch("/api/logout",{method:"GET",credentials:"include"}),n=await e.json();n.success&&(Object.assign(this,ht),localStorage.removeItem("user"),localStorage.setItem("user",JSON.stringify(this.$state)))},async login(){try{const e=await fetch("/api/login",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})});if(401===e.status)alert("Wrong Username or Password"),mt.push("/login");else{const n=await e.json();n.success&&(alert("Login successful"),this._id=n._id,this.username=n.username,this.name=n.name,this.email=n.email,this.isAdmin=n.isAdmin,this.chosenMosque=n.chosenMosque,this.loggedIn(),mt.push("/"))}}catch(e){console.log(e)}}}});var gt={setup(){const e=pt(),n=(0,p.iH)(!1),t=(0,p.iH)(""),o=()=>{n.value=!n.value},s=()=>{n.value=!1},l=()=>{t.value="dark"===t.value?"light":"dark",localStorage.setItem("theme",t.value),r()},r=()=>{const e="dark"===t.value?"dark":"light";document.body.setAttribute("data-bs-theme",e)};return(0,a.bv)((async()=>{await e.loggedIn(),t.value=localStorage.getItem("theme")||"dark",r()})),{user:e,isNavbarOpen:n,theme:t,toggleNavbar:o,closeNavbar:s,toggleTheme:l}}};const _t=(0,C.Z)(gt,[["render",h]]);var bt=_t;t(2166);const ft=(0,s.WB)();(0,o.ri)(bt).use(mt).use(ft).mount("#app");const wt=pt();(0,a.YP)(wt,(e=>{localStorage.setItem("user",JSON.stringify(e))}),{deep:!0})}},n={};function t(o){var s=n[o];if(void 0!==s)return s.exports;var a=n[o]={exports:{}};return e[o].call(a.exports,a,a.exports,t),a.exports}t.m=e,function(){var e=[];t.O=function(n,o,s,a){if(!o){var l=1/0;for(d=0;d<e.length;d++){o=e[d][0],s=e[d][1],a=e[d][2];for(var r=!0,i=0;i<o.length;i++)(!1&a||l>=a)&&Object.keys(t.O).every((function(e){return t.O[e](o[i])}))?o.splice(i--,1):(r=!1,a<l&&(l=a));if(r){e.splice(d--,1);var u=s();void 0!==u&&(n=u)}}return n}a=a||0;for(var d=e.length;d>0&&e[d-1][2]>a;d--)e[d]=e[d-1];e[d]=[o,s,a]}}(),function(){t.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(n,{a:n}),n}}(),function(){t.d=function(e,n){for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})}}(),function(){t.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)}}(),function(){t.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={143:0};t.O.j=function(n){return 0===e[n]};var n=function(n,o){var s,a,l=o[0],r=o[1],i=o[2],u=0;if(l.some((function(n){return 0!==e[n]}))){for(s in r)t.o(r,s)&&(t.m[s]=r[s]);if(i)var d=i(t)}for(n&&n(o);u<l.length;u++)a=l[u],t.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return t.O(d)},o=self["webpackChunkclient"]=self["webpackChunkclient"]||[];o.forEach(n.bind(null,0)),o.push=n.bind(null,o.push.bind(o))}();var o=t.O(void 0,[998],(function(){return t(6743)}));o=t.O(o)})();
//# sourceMappingURL=app.0b6dcd99.js.map