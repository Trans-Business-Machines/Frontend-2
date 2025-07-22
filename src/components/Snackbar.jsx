import "./Snackbar.css";

function SnackBar({ icon: Icon, message, type }) {
  return (
    <div className={`snackbar ${type}`}>
      <div className={`snackbar-icon ${type}`}>
        {Icon && (
          <Icon
            color={type === "warning" ? "orange" : "white"}
            size={type === "warning" ? 32 : 16}
          />
        )}
      </div>
      <p>{message}</p>
    </div>
  );
}

export default SnackBar;