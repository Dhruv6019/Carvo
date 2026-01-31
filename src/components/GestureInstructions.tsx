import React from 'react';

const GestureInstructions: React.FC = () => {
    return (
        <div className="absolute bottom-10 left-10 z-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 max-w-sm transition-all hover:scale-[1.02]">
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white p-1 rounded mr-2 text-xs">AI</span>
                Gesture Controls
            </h3>
            <div className="space-y-3">
                {[
                    { icon: '👍', action: 'Zoom In', desc: 'Show Thumbs Up' },
                    { icon: '👎', action: 'Zoom Out', desc: 'Show Thumbs Down' },
                    { icon: '✋', action: 'Open/Close Doors', desc: 'Show Open Palm' },
                    { icon: '✊', action: 'Change Color', desc: 'Show Closed Fist' },
                    { icon: '✌️', action: 'Toggle Rotation', desc: 'Show Peace Sign' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 group cursor-default">
                        <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">{item.action}</p>
                            <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GestureInstructions;
