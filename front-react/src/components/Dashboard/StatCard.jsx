function StatCard({ title, value, unit}) {
    return (
        <section className="stat-card">
            <h2>{title}</h2>

            <p className="stat-value">
                {value} {unit}
            </p>
        </section>
    );
}

export default StatCard;