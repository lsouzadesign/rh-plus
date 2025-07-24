'use client';

import React, { useRef, useState } from 'react';

type Job = {
    id: number;
    companyLogo: string;
    jobTitle: string;
    companyName: string;
    skills: string[];
    description: string;
};

type JobCardProps = {
    job: Job;
    style: React.CSSProperties;
    onSwipe: (direction: number) => void;
};

const JobCard: React.FC<JobCardProps> = ({ job, style, onSwipe }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [cardStyle, setCardStyle] = useState(style);

    const isDragging = useRef(false);
    const startX = useRef(0);

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        isDragging.current = true;
        startX.current = 'pageX' in e ? e.pageX : e.touches[0].pageX;
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging.current || !cardRef.current) return;
        const currentX = 'pageX' in e ? e.pageX : e.touches[0].pageX;
        const diffX = currentX - startX.current;
        const rotate = diffX * 0.05;
        cardRef.current.style.transform = `translateX(${diffX}px) rotate(${rotate}deg)`;
    };

    const handleDragEnd = () => {
        if (!isDragging.current || !cardRef.current) return;
        isDragging.current = false;
        const transform = cardRef.current.style.transform;
        const x = parseInt(transform.split('(')[1]?.split('px')[0] || '0');
        const decisionThreshold = 100;

        if (Math.abs(x) > decisionThreshold) {
            onSwipe(x > 0 ? 1 : -1);
        } else {
            cardRef.current.style.transition = 'transform 0.3s ease';
            cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
        }
    };

    return (
        <div
            ref={cardRef}
            style={cardStyle}
            className="swipe-card"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onMouseMove={handleDragMove}
            onTouchMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
            onMouseLeave={handleDragEnd}
        >
            <div className="relative h-3/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={job.companyLogo} alt={job.companyName} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                    <h2 className="text-2xl font-bold text-white">{job.jobTitle}</h2>
                    <p className="text-md text-gray-200">${job.companyName}</p>
                </div>
                <div className="choice-indicator like">INTERESSE</div>
                <div className="choice-indicator nope">PASSAR</div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Competências:</h3>
                    <div className="flex flex-wrap gap-2">
                        {job.skills.map(skill => (
                            <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
                <p className="text-gray-600 text-sm flex-grow">{job.description}</p>
            </div>
        </div>
    );
};

export default JobCard;
