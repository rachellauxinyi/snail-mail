import { useRef, useState, useEffect } from 'react';
import { X, Trash2, Check } from 'lucide-react';

interface SignatureCanvasProps {
  onSave: (signature: string) => void;
  onClose: () => void;
  paperTexture: string;
}

export function SignatureCanvas({ onSave, onClose, paperTexture }: SignatureCanvasProps) {
  const getTextureColor = (texture: string) => {
    switch (texture) {
      case 'cream':
        return '#FFF9F0';
      case 'aged':
        return '#F5F0E8';
      case 'parchment':
        return '#F2EDE3';
      case 'kraft':
        return '#E8DCC8';
      default:
        return '#FFF9F0';
    }
  };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 200;

    // Set drawing style
    ctx.strokeStyle = '#3E3831';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill with paper texture background
    ctx.fillStyle = getTextureColor(paperTexture);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [paperTexture]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = getTextureColor(paperTexture);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signature = canvas.toDataURL();
    onSave(signature);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#FEFDFB] border-2 border-[#D4CFC5] p-6 shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#3E3831] tracking-wide">Sign Your Letter</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#D4CFC5] transition-colors"
          >
            <X className="w-5 h-5 text-[#3E3831]" />
          </button>
        </div>

        <div className="mb-4">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full border-2 border-[#D4CFC5] cursor-crosshair"
            style={{ touchAction: 'none' }}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={clear}
            className="flex-1 px-4 py-2 border-2 border-[#D4CFC5] bg-[#FEFDFB] text-[#3E3831] hover:bg-[#F7F4F0] transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={save}
            className="flex-1 px-4 py-2 border-2 border-[#8B7355] bg-[#8B7355] text-[#FEFDFB] hover:bg-[#6B5335] transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Signature
          </button>
        </div>
      </div>
    </div>
  );
}
