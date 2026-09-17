import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getDatabase,
    ref,
      push,
        set,
          onValue,
            update,
  get
            } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

            const firebaseConfig = {
              apiKey: "AIzaSyDqOQn9qsFk33y36w-Bwc2ko5P-9elXd1g",
                authDomain: "ind-go.firebaseapp.com",
                  databaseURL: "https://ind-go-default-rtdb.firebaseio.com",
                    projectId: "ind-go",
                      storageBucket: "ind-go.firebasestorage.app",
                        messagingSenderId: "1046289575112",
                          appId: "1:1046289575112:web:6929e7aeadc82612dfc9fd",
                            measurementId: "G-HX1N3LVCQW"
                            };

                            const app = initializeApp(firebaseConfig);
                            const db = getDatabase(app);

                            const tabs = document.querySelectorAll(".tab");
                            const views = document.querySelectorAll(".view");

                            tabs.forEach(t => {
                              t.onclick = () => {
                                  tabs.forEach(x => x.classList.remove("active"));
                                      views.forEach(v => v.classList.remove("active"));
                                          t.classList.add("active");
                                              document.getElementById(t.dataset.view).classList.add("active");
                                                };
                                                });

                                                let vehicle = "Bike";

                                                const fares = {
                                                  Bike: "₹80–₹110",
                                                    Auto: "₹110–₹160",
                                                      Car: "₹160–₹220"
                                                      };

                                                      document.querySelectorAll(".vehicle").forEach(b => {
                                                        b.onclick = () => {
                                                            document.querySelectorAll(".vehicle")
                                                                  .forEach(x => x.classList.remove("selected"));

                                                                      b.classList.add("selected");
                                                                          vehicle = b.dataset.vehicle;
                                                                              document.getElementById("fare").textContent = fares[vehicle];
                                                                                };
                                                                                });

                                                                                let riderRideId = null;
let driverRideId = null;


                                                                                // RIDER: Book ride
                                                                                document.getElementById("bookRide").onclick = async () => {
                                                                                  const pickup = document.getElementById("pickup").value.trim();
                                                                                    const destination = document.getElementById("destination").value.trim();

                                                                                      if (!destination) {
                                                                                          document.getElementById("bookingStatus").textContent =
                                                                                                "Add a destination to find your ride.";
                                                                                                    return;
                                                                                                      }

                                                                                                        const rideRef = push(ref(db, "rides"));
                                                                                                          riderRideId = rideRef.key;

                                                                                                            await set(rideRef, {
                                                                                                                pickup: pickup || "Current location",
                                                                                                                    destination,
                                                                                                                        vehicle,
                                                                                                                            status: "requested",
                                                                                                                                createdAt: Date.now()
                                                                                                                                  });

                                                                                                                                    document.getElementById("bookingStatus").textContent =
                                                                                                                                        `Finding a ${vehicle} near you for ${destination}…`;
                                                                                                                                        };

                                                                                                                                        // RIDER: Listen for ride status
                                                                                                                                        onValue(ref(db, "rides"), snapshot => {
                                                                                                                                          const rides = snapshot.val();

                                                                                                                                            if (!rides) return;

                                                                                                                                              Object.entries(rides).forEach(([id, ride]) => {
                                                                                                                                                  if (id !== riderRideId) return;

                                                                                                                                                      if (ride.status === "accepted") {
                                                                                                                                                            document.getElementById("bookingStatus").textContent =
                                                                                                                                                                    "Ride accepted. Driver is coming to your pickup point.";
                                                                                                                                                                        }

                                                                                                                                                                            if (ride.status === "declined") {
                                                                                                                                                                                  document.getElementById("bookingStatus").textContent =
                                                                                                                                                                                          "Ride declined. Looking for another driver…";
                                                                                                                                                                                              }
                                                                                                                                                if (ride.status === "arrived") {
  document.getElementById("bookingStatus").textContent =
    "Driver has arrived at your pickup point.";
}

if (ride.status === "in_progress") {
  document.getElementById("bookingStatus").textContent =
    "Your ride has started.";
}

if (ride.status === "completed") {
  document.getElementById("bookingStatus").textContent =
    "Ride completed successfully.";
}
                                                                                                                                                
 
if (ride.status === "cancelled") {
  document.getElementById("bookingStatus").textContent =
    "Driver cancelled the ride. Looking for another driver…";
}
                                                                                                                                                                                                });
                                                                                                                                                                                                });

                                                                                                                                                                                                // DRIVER online/offline
                                                                                                                                                                                                document.getElementById("onlineBtn").onclick = e => {
                                                                                                                                                                                                  e.target.classList.toggle("on");

                                                                                                                                                                                                    const online = e.target.classList.contains("on");

                                                                                                                                                                                                      e.target.textContent = online ? "ONLINE" : "OFFLINE";

                                                                                                                                                                                                        document.getElementById("driverStatus").textContent =
                                                                                                                                                                                                            online
                                                                                                                                                                                                                  ? "You are online and can receive ride requests."
                                                                                                                                                                                                                        : "You are offline.";
                                                                                                                                                                                                                        };

                                                                                                                                                                                                                        // DRIVER: Listen for ride requests
document.getElementById("requestPickup").textContent =
  "Checking for ride requests...";

onValue(
  ref(db, "rides"),
  snapshot => {
    const rides = snapshot.val();
    console.log("DRIVER RIDES:", rides);

    if (!rides) {
      driverRideId = null;
      document.getElementById("requestPickup").textContent =
        "No new ride request";
      document.getElementById("requestDestination").textContent = "";
      return;
    }

    const requests = Object.entries(rides)
      .filter(([id, ride]) => ride && ride.status === "requested");

    if (requests.length === 0) {
      driverRideId = null;
      document.getElementById("requestPickup").textContent =
        "No new ride request";
      document.getElementById("requestDestination").textContent = "";
      return;
    }

    const [id, ride] = requests[0];

    driverRideId = id;

    document.getElementById("requestFare").textContent =
      ride.fare || "";

    document.getElementById("requestPickup").textContent =
      `📍 ${ride.pickup}`;

    document.getElementById("requestDestination").textContent =
      `→ ${ride.destination} · ${ride.vehicle}`;

    document.getElementById("driverStatus").textContent =
      `Ride request: ${ride.pickup} → ${ride.destination}`;
  },
  error => {
    document.getElementById("driverStatus").textContent =
      `Firebase error: ${error.message}`;
  }
);                                                                                                                                                                                                                        
                                                                                                                                                                                                                          

                                                                                                                                                                                                                            

                                                                                                                                                                                                                              
                                                                                                                                                                                                                                  

                                                                                                                                                                                                                                    

                                                                                                                                                                                                                                      

                                                                                                                                                                                                                                        

                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                              
                                                                                                          

                                                                                                                                                                                                                                              // DRIVER: Accept / Arrived / Start / Complete
document.getElementById("accept").onclick = async () => {
  if (!driverRideId) {
    document.getElementById("driverStatus").textContent =
      "No active ride available.";
    return;
  }

  const rideRef = ref(db, `rides/${driverRideId}`);

  const snapshot = await get(rideRef);
  const ride = snapshot.val();

  if (!ride) return;

  if (ride.status === "requested") {
    await update(rideRef, {
      status: "accepted"
    });

    document.getElementById("accept").textContent = "Arrived at pickup";
    document.getElementById("driverStatus").textContent =
      "Ride accepted. Navigate to the pickup point.";

  } else if (ride.status === "accepted") {
    await update(rideRef, {
      status: "arrived"
    });

    document.getElementById("accept").textContent = "Start Ride";
    document.getElementById("driverStatus").textContent =
      "Driver arrived at pickup point.";

  } else if (ride.status === "arrived") {
    await update(rideRef, {
      status: "in_progress"
    });

    document.getElementById("accept").textContent = "Complete Ride";
    document.getElementById("driverStatus").textContent =
      "Ride started.";

  } else if (ride.status === "in_progress") {
    await update(rideRef, {
      status: "completed"
    });

    document.getElementById("accept").textContent = "Ride Completed";
    document.getElementById("driverStatus").textContent =
      "Ride completed successfully.";
  }
};

// DRIVER: Cancel Ride
document.getElementById("decline").onclick = async () => {
  if (!driverRideId) {
    document.getElementById("driverStatus").textContent =
      "No ride request available.";
    return;
  }

  await update(ref(db, `rides/${driverRideId}`), {
    status: "cancelled"
  });

  driverRideId = null;

  document.getElementById("requestPickup").textContent =
    "📍 Waiting for rider...";

  document.getElementById("requestDestination").textContent =
    "→ No ride request yet";

  document.getElementById("driverStatus").textContent =
    "Ride cancelled.";
};
// IND ONE: Future service card click system
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", () => {
    const service = card.dataset.service;

    console.log("IND ONE SERVICE:", service);
  });
});
 // IND ONE: Open FixNow
document.querySelector('[data-service="fixnow"]').addEventListener("click", () => {
  document.getElementById("rider").style.display = "none";
  document.getElementById("fixnow").style.display = "block";
});
                                                                                                                                                                                                                                                                           
