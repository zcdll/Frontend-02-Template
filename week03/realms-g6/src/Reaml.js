import React, { useEffect } from "react";
import G6 from "@antv/g6";
import getReamlsG6Data from "./reamls.js";

function Reamls() {
  const g6Ref = React.useRef(null);
  let graph = null;

  useEffect(() => {
    if (!graph) {
      const G6Data = getReamlsG6Data();

      const width = 1920;
      const height = 1080;
      graph = new G6.TreeGraph({
        container: g6Ref.current,
        width,
        height,
        modes: {
          default: [
            {
              type: "collapse-expand",
              onChange: function onChange(item, collapsed) {
                const data = item.get("model").data;
                data.collapsed = collapsed;
                return true;
              },
            },
            "drag-canvas",
            "zoom-canvas",
          ],
        },
        defaultNode: {
          size: 26,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
          style: {
            fill: "#C6E5FF",
            stroke: "#5B8FF9",
          },
        },
        defaultEdge: {
          type: "cubic-horizontal",
          style: {
            stroke: "#A3B1BF",
          },
        },
        layout: {
          type: "mindmap",
          direction: "H",
          getId: function getId(d) {
            return d.id;
          },
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth() {
            return 16;
          },
          getVGap: function getVGap() {
            return 10;
          },
          getHGap: function getHGap() {
            return 100;
          },
        },
      });

      graph.node(function (node) {
        return {
          label: node.id,
          labelCfg: {
            offset: 10,
            position:
              node.children && node.children.length > 0 ? "left" : "right",
          },
        };
      });

      graph.data({ id: "reamls", children: G6Data });
      graph.render();
      graph.fitView();
    }
  }, []);

  return (
    <div>
      Reamls
      <div id="mountNode" ref={g6Ref}></div>
    </div>
  );
}

export default Reamls;
