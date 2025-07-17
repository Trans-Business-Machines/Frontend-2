import { SpinnerDotted } from "spinners-react";

function Loading() {
  return (
    <section
      className="bg-blue-green-gradient"
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <p
          style={{
            fontWeight: "600",
            fontSize: "2.5rem",
            color: "white",
          }}
        >
          Verifying user...
        </p>
        <SpinnerDotted size={100} thickness={100} speed={100} color="#ffffff" />
      </div>
    </section>
  );
}

export default Loading;
