import { Star, ArrowUp, ArrowDown } from 'lucide-react';

export function PointsHistory({ log = [] }) {
  if (!log || log.length === 0) {
    return (
      <div className="text-sm text-gray-400 text-center py-4">
        Tiada sejarah points.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {log.map((item, i) => {
        const isEarn = item.jenis === 'DAPAT' || item.jumlah > 0;
        return (
          <div
            key={item.id || i}
            className="flex items-center justify-between text-sm border-b border-gray-100 py-2"
          >
            <div className="flex items-center gap-2">
              {isEarn ? (
                <ArrowUp size={14} className="text-green-500" />
              ) : (
                <ArrowDown size={14} className="text-red-500" />
              )}
              <div>
                <div className="font-medium">{item.nota || item.jenis}</div>
                <div className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString('ms-MY')}
                </div>
              </div>
            </div>
            <div className={`font-bold ${isEarn ? 'text-green-600' : 'text-red-600'}`}>
              {isEarn ? '+' : ''}{item.jumlah}
            </div>
          </div>
        );
      })}
    </div>
  );
}
