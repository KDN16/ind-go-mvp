const tabs=document.querySelectorAll(".tab"), views=document.querySelectorAll(".view");
tabs.forEach(t=>t.onclick=()=>{tabs.forEach(x=>x.classList.remove("active"));views.forEach(v=>v.classList.remove("active"));t.classList.add("active");document.getElementById(t.dataset.view).classList.add("active")});
let vehicle="Bike"; const fares={Bike:"₹80–₹110",Auto:"₹110–₹160",Car:"₹160–₹220"};
document.querySelectorAll(".vehicle").forEach(b=>b.onclick=()=>{document.querySelectorAll(".vehicle").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");vehicle=b.dataset.vehicle;document.getElementById("fare").textContent=fares[vehicle]});
document.getElementById("bookRide").onclick=()=>{const dest=document.getElementById("destination").value.trim();document.getElementById("bookingStatus").textContent=dest?`Finding a ${vehicle} near you for ${dest}…`:"Add a destination to find your ride.";};
document.getElementById("onlineBtn").onclick=e=>{e.target.classList.toggle("on");e.target.textContent=e.target.classList.contains("on")?"ONLINE":"OFFLINE";document.getElementById("driverStatus").textContent=e.target.classList.contains("on")?"You are online and can receive ride requests.":"You are offline.";};
document.getElementById("accept").onclick=()=>document.getElementById("driverStatus").textContent="Ride accepted. Navigate to the pickup point.";
document.getElementById("decline").onclick=()=>document.getElementById("driverStatus").textContent="Ride declined.";
