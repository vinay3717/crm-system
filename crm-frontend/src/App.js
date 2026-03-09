import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const stages = ["Lead", "Contacted", "Demo", "Negotiation", "Won", "Lost"];

function App() {
  const [deals, setDeals] = useState([]);

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

    // Later we will also update the stage in Django
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>CRM Pipeline</h1>

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
                            style={{
                              background: "white",
                              padding: "10px",
                              marginBottom: "10px",
                              borderRadius: "6px",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
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
    </div>
  );
}

export default App;