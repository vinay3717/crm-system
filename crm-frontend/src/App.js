import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const stages = ["Lead", "Contacted", "Demo", "Negotiation", "Won", "Lost"];

function App() {
  const [deals, setDeals] = useState([]);
  const [client, setClient] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState("Lead");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [activities, setActivities] = useState([]);
  const [note, setNote] = useState("");

  const loadActivities = (dealId) => {

  fetch(`http://127.0.0.1:8000/api/deals/${dealId}/activities/`)
    .then(res => res.json())
    .then(data => setActivities(data));

};
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/deals/")
      .then(res => res.json())
      .then(data => setDeals(data));
  }, []);

  const onDragEnd = (result) => {

  if (!result.destination) return;

  const dealId = result.draggableId;
  const newStage = result.destination.droppableId;

  const updatedDeals = deals.map((deal) =>
    deal.id.toString() === dealId
      ? { ...deal, stage: newStage }
      : deal
  );

  setDeals(updatedDeals);

  // Send update to Django
  fetch(`http://127.0.0.1:8000/api/deals/${dealId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      stage: newStage
    })
  });
};
const handleSubmit = (e) => {
  e.preventDefault();

  fetch("http://127.0.0.1:8000/api/create-deal/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client: client,
      value: value,
      stage: stage
    })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    console.log("Deal created successfully:", data);
    // fetch updated deals list
    fetch("http://127.0.0.1:8000/api/deals/")
      .then(res => res.json())
      .then(data => setDeals(data));

    setClient("");
    setValue("");
    setStage("Lead");
  })
  .catch((error) => {
    console.error("Error creating deal:", error);
    alert("Error creating deal: " + error.message);
  });
};

  return (
    
    <div style={{ padding: "40px" }}>
      <h1>CRM Pipeline</h1>

      <form onSubmit={handleSubmit} style={{marginBottom:"30px"}}>
        <h2>Create Deal</h2>
        
        <input
          placeholder="Client Name"
          value={client}
          onChange={(e)=>setClient(e.target.value)}
        />
        
        <input
          placeholder="Deal Value"
          value={value}
          onChange={(e)=>setValue(e.target.value)}
        />
        
        <select value={stage} onChange={(e)=>setStage(e.target.value)}>
          <option>Lead</option>
          <option>Contacted</option>
          <option>Demo</option>
          <option>Negotiation</option>
          <option>Won</option>
          <option>Lost</option>
        </select>
        
        <button type="submit">Create Deal</button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
          {stages.map((stage) => (
            <Droppable key={stage} droppableId={stage}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: "#f4f4f4",
                    padding: "15px",
                    borderRadius: "8px",
                    width: "200px",
                    minHeight: "200px",
                  }}
                >
                  <h3>{stage}</h3>

                  {deals
                    .filter((deal) => deal.stage === stage)
                    .map((deal, index) => (
                      <Draggable
                        key={deal.id}
                        draggableId={deal.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => {
                              setSelectedDeal(deal);
                              loadActivities(deal.id);
                            }}
                            style={{
                              background: "white",
                              padding: "10px",
                              marginBottom: "10px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <strong>{deal.client_name}</strong>
                            <p>₹{deal.value}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {selectedDeal && (
        <div style={{
          marginTop: "40px",
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "8px"
        }}>
          <h2>{selectedDeal.client_name} Activity</h2>

          <h3>History</h3>

          {activities.map((activity, index) => (
            <div key={index}>
              <p>{activity.note}</p>
              <small>{activity.date}</small>
              <hr />
            </div>
          ))}

          <h3>Add Activity</h3>

          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add note"
          />

          <button onClick={() => {
            fetch("http://127.0.0.1:8000/api/add-activity/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                deal_id: selectedDeal.id,
                note: note
              })
            })
            .then(() => {
              setNote("");
              loadActivities(selectedDeal.id);
            })
          }}>
            Add
          </button>
        </div>
      )}
    </div>
  );
}

export default App;