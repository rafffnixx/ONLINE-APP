import "../styles/Widget.css"; // ✅ Ensure Widget has its own styles

const Widget = ({ title, value }) => {
    return (
        <div className="widget">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
};

export default Widget;
