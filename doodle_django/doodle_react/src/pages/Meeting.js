import { Link } from "react-router-dom";

const Meeting = () => {
  return (
    <div>
      <h1>Meeting</h1>
      <Link to="/meeting/creation">Create Meeting</Link>
      <Link to="/meeting/manage">Manage Meeting</Link>
    </div>
  );
};

export default Meeting;
