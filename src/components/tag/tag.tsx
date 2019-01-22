import * as React from 'react'
import ClassNames from 'classnames'
import { TagProps } from './interface'
import Icon from '../icon'

import './style/index.scss'

const { useState } = React

const noop = () => {}

const defaultProps: TagProps = {
  size: 'normal',
  onClick: noop,
  closable: false,
  onClose: noop
}

const prefixCls = 'uni-tag'

const getClassNames = ({ size, closable, className }: TagProps) => {
  return ClassNames(prefixCls, className, {
    [`${prefixCls}-${size}`]: size,
    [`${prefixCls}-closable`]: closable
  })
}

const getStyle = (color?: string) => {
  let style: any = {}
  if (color) {
    style.border = 'none'
    style.color = '#fff'
    style.background = color
  }
  return style
}

const handleClose = ({ event, setVisible, onClose }: any) => {
  event.stopPropagation()
  onClose()
  setVisible(false)
}

const Tag: React.FC<TagProps> & { defaultProps: Partial<TagProps> } = props => {
  const [visible, setVisible] = useState(true)
  const { closable, color, onClose, onClick, style } = props
  const classStr = getClassNames(props)
  const wrapperStyle = getStyle(color)
  return visible ? (
    <div className={classStr} onClick={onClick} style={style}>
      <div className={`${prefixCls}-wrapper`} style={wrapperStyle}>
        <span className={`${prefixCls}-wrapper-content`}>{props.children}</span>
        {closable ? (
          <Icon type="close" onClick={event => handleClose({ event, setVisible, onClose })} />
        ) : null}
      </div>
    </div>
  ) : null
}

Tag.defaultProps = defaultProps

export default Tag
