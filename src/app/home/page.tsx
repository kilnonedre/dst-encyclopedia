'use client'

import React, { useEffect, useRef } from 'react'
import { Graph } from '@antv/g6'
import styles from './homeStyle.module.scss'

const data = {
  nodes: [
    {
      id: 'node1',
      label: '1111111',
    },
    {
      id: 'node2',
    },
    {
      id: 'node3',
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
    },
  ],
}

const Home = () => {
  const mountNode = useRef<HTMLDivElement>(null)

  let graph: Graph | null = null

  useEffect(() => {
    if (mountNode.current && !graph) {
      graph = new Graph({
        container: mountNode.current,
        layout: {
          type: 'force', // 指定为力导向布局
          preventOverlap: true, // 防止节点重叠
          linkDistance: 50, // 边的理想长度
        },
        modes: {
          // 支持的 behavior
          default: ['drag-canvas', 'drag-node'],
          // edit: ['click-select'],
        },
      })

      graph.data(data)
      graph.render()
    }
  }, [])

  return (
    <div>
      <div className={styles['test']} ref={mountNode}></div>
    </div>
  )
}

export default Home
