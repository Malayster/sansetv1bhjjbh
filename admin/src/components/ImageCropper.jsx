export default function ImageCropper({
  cropState,
  setCropState,
  zoom,
  setZoom,
  offset,
  setOffset,
  isDragging,
  setIsDragging,
  dragStart,
  setDragStart,
  executeCropAndUpload,
  loading
}) {
  if (!cropState.isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>Potong Imej</h3>
          <button className="btn-icon" onClick={() => setCropState(prev => ({ ...prev, isOpen: false }))}>×</button>
        </div>
        <div className="modal-body" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 300,
              height: 300,
              margin: '0 auto',
              overflow: 'hidden',
              border: '2px solid #ccc',
              cursor: isDragging ? 'grabbing' : 'grab',
              position: 'relative',
              background: '#000'
            }}
            onMouseDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y }); }}
            onMouseMove={(e) => { if (!isDragging) return; setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <img
              src={cropState.imageSrc}
              alt="crop"
              style={{
                position: 'absolute',
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transformOrigin: 'center',
                maxWidth: 'none'
              }}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <label>Zoom: {zoom.toFixed(1)}x</label>
            <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setCropState(prev => ({ ...prev, isOpen: false }))}>Batal</button>
          <button className="btn btn-primary" onClick={executeCropAndUpload} disabled={loading}>
            {loading ? 'Memuat naik...' : 'Simpan & Muat Naik'}
          </button>
        </div>
      </div>
    </div>
  );
}
