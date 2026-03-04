type CardProps = {
  title: string;
  description: string;
  status?: string;
};

function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'planned':   return 'card__status-pill--planned';
    case 'ongoing':   return 'card__status-pill--ongoing';
    case 'completed': return 'card__status-pill--completed';
    default:          return 'card__status-pill--default';
  }
}

export function Card({ title, description, status }: CardProps) {
  return (
    <article className="card">
      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        <p className="card__description">{description}</p>
      </div>
      {status ? (
        <div className={`card__status-pill ${getStatusClass(status)}`}>
          <span className="card__status-text">{status}</span>
        </div>
      ) : null}
    </article>
  );
}