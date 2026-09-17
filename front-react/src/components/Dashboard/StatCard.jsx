function StatCard({ title, value, unit, icon, variant }) {
  return (
    <section className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-icon">
        <span>{icon}</span>
      </div>

      <div className="stat-card-content">
        <p className="stat-value">
          {value}
          {unit && <span className="stat-unit"> {unit}</span>}
        </p>

        <h2>{title}</h2>
      </div>
    </section>
  );
}

export default StatCard;