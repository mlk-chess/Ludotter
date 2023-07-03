import React, { useRef, useEffect, Children, cloneElement } from "react";

type RowProps = {
  children: React.ReactNode;
  speed: number;
  playing: boolean;
};

const Row = ({ children, speed, playing }: RowProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const clonedScrollerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
  const playingRef = useRef(playing);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  const clonedChildren = Children.map(children, (child) =>
      cloneElement(child as React.ReactElement<any>)
  );

  useEffect(() => {
    const pixelsPerFrame = speed / 60;
    let animating = true;
    let scrollerXPos = 0;
    let clonedScrollerXPos = 0;
    function animate() {
      if (playingRef.current) {
        if (hoverRef.current) {
          scrollerXPos -= pixelsPerFrame / 2;
          clonedScrollerXPos -= pixelsPerFrame / 2;
        } else {
          scrollerXPos -= pixelsPerFrame;
          clonedScrollerXPos -= pixelsPerFrame;
        }

      if (scrollerRef.current && scrollerRef.current.offsetWidth) {
        if (scrollerXPos <= -scrollerRef.current!.offsetWidth) {
          scrollerXPos = scrollerRef.current!.offsetWidth;
        }

        if (
            clonedScrollerXPos <=
            -clonedScrollerRef.current!.offsetWidth * 2
        ) {
          clonedScrollerXPos = 0;
        }

        scrollerRef.current!.style.transform = `translateX(${scrollerXPos}px)`;
        clonedScrollerRef.current!.style.transform = `translateX(${clonedScrollerXPos}px)`;
      }
      }

      if (animating) {
        window.requestAnimationFrame(animate);
      }
    }
    window.requestAnimationFrame(animate);

    return () => {
      animating = false;
    };
  }, []);

  return (
      <div
          className="row flex w-full mb-4"
          onMouseOver={() => (hoverRef.current = true)}
          onMouseOut={() => (hoverRef.current = false)}
      >
        <div ref={scrollerRef}>{children}</div>
        <div ref={clonedScrollerRef}>{clonedChildren}</div>
      </div>
  );
};

export default Row;
