import { Table } from 'react-bootstrap';

const MEDALS = ['🥇', '🥈', '🥉'];


export default function RankingTable({ rows, meUsername }) {
  if (!rows.length) return <p className="lr-subtle mb-0">No games have been played yet.</p>;
  return (
    <Table hover responsive className="mb-0 align-middle">
      <thead>
        <tr>
          <th style={{ width: 60 }}>#</th>
          <th>Player</th>
          <th className="text-end">Best score</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const isMe = r.username === meUsername;
          return (
            <tr key={r.username} className={`${i === 0 ? 'lr-rank-1' : ''} ${isMe ? 'lr-rank-me' : ''}`.trim()}>
              <td>{MEDALS[i] ? <span className="lr-rank-medal">{MEDALS[i]}</span> : i + 1}</td>
              <td>
                {r.name} <span className="lr-subtle">@{r.username}</span>
                {isMe && <span className="lr-rank-you">you</span>}
              </td>
              <td className="text-end">{r.bestScore}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
