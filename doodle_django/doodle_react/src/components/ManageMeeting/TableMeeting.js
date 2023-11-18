import correctImage from "../images/correct.png";
import noImage from "../images/no.png";
import waitImage from "../images/wait.png";
import maybeImage from "../images/maybe.png";
import user from "../images/user.png";
import "./manage.css";

const TableMeeting = ({ selectedColumn, columnSelection }) => {
  const renderCellContent = (column, row) => {
    if (row[column] === "yes") {
      return (
        <div className="table_image">
          <img src={correctImage} alt="correct.png" />
        </div>
      );
    } else if (row[column] === "maybe") {
      return (
        <div className="table_image">
          <img src={maybeImage} alt="maybe.png" />
        </div>
      );
    } else if (row[column] === "wait") {
      return (
        <div className="table_image">
          <img src={waitImage} alt="wait.png" />
        </div>
      );
    } else {
      return (
        <div className="table_image">
          <img src={noImage} alt="no.png" />
        </div>
      );
    }
  };
  const data = [
    {
      partecipants: "Fabio Cangeri",
      month: "yes",
      month2: "no",
    },
    {
      partecipants: "Tsion",
      month: "maybe",
      month2: "yes",
    },
    {
      partecipants: "Degefom",
      month: "no",
      month2: "yes",
    },
    {
      partecipants: "Hilary",
      month: "wait",
      month2: "no",
    },
  ];

  return (
    <div>
      <table
        id="table_meeting"
        style={{
          border: "3px solid #f5f5f5",
          borderRadius: "8px",
          width: "-webkit-fill-available",
          marginRight: "15px",
          marginLeft: "15px",
        }}
      >
        <thead>
          <tr>
            {Object.keys(data[0]).map((column, index) => (
              <th
                key={index}
                style={{ position: "relative" }}
                onClick={() => columnSelection(column)}
                className={
                  selectedColumn === column ? "selected_column" : ""
                }
              >
                {index === 0 ? (
                  <label
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    <h4 id="partecipants_text">Partecipants</h4>
                  </label>
                ) : (
                  <label>
                    <img
                      id="star"
                      className={
                        selectedColumn === column
                          ? "img_star_select"
                          : "img_star_unselect"
                      }
                    />
                    <br />
                    <p>{column}</p>
                    <p>m* day</p>
                    <p>day</p>
                    <p>start_time</p>
                    <p>end_time</p>
                    <div className="div_user">
                      <img src={user} alt="user" />
                      <nobr> 2</nobr>
                    </div>
                  </label>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(row).map((column, colIndex) => (
                <td
                  key={colIndex}
                  onClick={() => columnSelection(column)}
                  className={
                    selectedColumn  === column ? "selected_column" : ""
                  }
                >
                  {column === "partecipants" ? (
                    <p className="partecipants">{row[column]}</p>
                  ) : (
                    renderCellContent(column, row)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableMeeting;
