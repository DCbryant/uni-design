import * as React from 'react'
import ClassNames from 'classnames'
import Icon from '../icon'
import { InputProps } from './interface'
import { compose, omit } from '../utils'
import './style/index.scss'

const { useRef, useEffect } = React

const noop = () => {}
const prefixCls = 'uni-input'

const defaultProps: InputProps = {
  type: 'text',
  disabled: false,
  autoFocus: false,
  clear: false,
  onChange: noop,
  onBlur: noop,
  onFocus: noop
}

const normalizeValue = (value?: string) => {
  if (typeof value === 'undefined' || value === null) {
    return ''
  }
  return value
}

const getClassName = ({ disabled, className }: InputProps) => {
  return ClassNames(prefixCls, className, {
    [`${prefixCls}-disabled`]: disabled
  })
}

const getTrueType = (type: string) => {
  let inputType: string = 'text'
  if (type === 'bankCard' || type === 'mobile') {
    inputType = 'tel'
  } else if (type === 'password') {
    inputType = 'password'
  } else {
    inputType = type
  }
  return inputType
}

const omitProps = (props: InputProps) => {
  const excludeProps = [
    'onChange',
    'onBlur',
    'type',
    'prefix',
    'suffix',
    'clear',
    'className',
    'addonBefore',
    'addonAfter'
  ]
  return omit(props, excludeProps)
}

const formatValue = (value: string, type: string) => {
  let newValue = value
  switch (type) {
    case 'bankCard':
      newValue = value.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ')
      break
    case 'mobile':
      newValue = value.replace(/\D/g, '').substring(0, 11)
      const valueLen = newValue.length
      if (valueLen > 3 && valueLen < 8) {
        newValue = `${newValue.substr(0, 3)} ${newValue.substr(3)}`
      } else if (valueLen >= 8) {
        newValue = `${newValue.substr(0, 3)} ${newValue.substr(3, 4)} ${newValue.substr(7)}`
      }
      break
    // case 'number':
    //   newValue = value.replace(/\D/g, '')
    //   break
    case 'text':
    case 'password':
    case 'number':
    default:
      break
  }
  return newValue
}

const parseValue = ({ type, value }: { type: string; value?: string }) => {
  const newValue = value
  const inputValue = compose(
    (v: string) => formatValue(v, type),
    normalizeValue
  )(newValue)
  return inputValue
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement>, { onChange, type }: InputProps) => {
  const value = e.target.value
  const newValue = parseValue({ type, value: value })
  onChange(newValue)
}

const handleBlur = (
  value: string,
  e: React.FocusEvent<HTMLInputElement>,
  { onBlur }: InputProps
) => {
  onBlur(value, e)
}

const renderPrefix = ({ prefix }: InputProps) => {
  if (prefix) {
    return <div className={`${prefixCls}-prefix`}>{prefix}</div>
  }
  return null
}

const renderSuffix = ({ suffix }: InputProps) => {
  if (suffix) {
    return <div className={`${prefixCls}-suffix`}>{suffix}</div>
  }
  return null
}

const renderClearIcon = (
  { disabled, value, defaultValue, clear, onChange }: InputProps,
  inputRef: any
) => {
  const newValue = normalizeValue(value || defaultValue)
  if (!disabled && newValue && newValue.length && clear) {
    return (
      <Icon
        type="close-circle"
        onClick={() => {
          onChange('')
          ;(inputRef.current as any).focus()
        }}
        size={16}
        color="#999"
      />
    )
  }
  return null
}

const renderAddonBefore = ({ addonBefore }: InputProps) => {
  if (addonBefore) {
    return (
      <div className={`${prefixCls}-addon-before`}>
        <div className="before">{addonBefore}</div>
      </div>
    )
  }
  return null
}

const renderAddonAfter = ({ addonAfter }: InputProps) => {
  if (addonAfter) {
    return (
      <div className={`${prefixCls}-addon-after`}>
        <div className="after">{addonAfter}</div>
      </div>
    )
  }
  return null
}

const Input: React.SFC<InputProps> & { defaultProps: Partial<InputProps> } = props => {
  const inputRef = useRef(null)
  const type = getTrueType(props.type)
  const { autoFocus, addonAfter, addonBefore } = props
  const restProps = omitProps(props)
  if ('value' in restProps) {
    restProps.value = normalizeValue(props.value)
    // Input elements must be either controlled or uncontrolled,
    // specify either the value prop, or the defaultValue prop, but not both.
    delete restProps.defaultValue
  }
  const inputClass = ClassNames(`${prefixCls}-input`, {
    [`${prefixCls}-group`]: !!addonBefore || !!addonAfter
  })
  useEffect(
    () => {
      inputRef && autoFocus && (inputRef.current as any).focus()
      return () => {}
    },
    [inputRef]
  )
  return (
    <div className={getClassName(props)}>
      <div className={`${prefixCls}-container`}>
        {renderPrefix(props)}
        <div className={inputClass}>
          {renderAddonBefore(props)}
          <div className={`${prefixCls}-input-content`}>
            <input
              type={type}
              ref={inputRef}
              onChange={e => handleChange(e, props)}
              onBlur={e => handleBlur(restProps.value, e, props)}
              {...restProps}
            />
            {renderClearIcon(props, inputRef)}
          </div>
          {renderAddonAfter(props)}
        </div>
        {renderSuffix(props)}
      </div>
    </div>
  )
}

Input.defaultProps = defaultProps

export default Input
