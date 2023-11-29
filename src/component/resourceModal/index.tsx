import React, { useEffect, useState } from 'react'
import styles from './resourceModalStyle.module.scss'
import types from './resourceModalType.d'
import resourceTypes from '@/app/api/resources/resourceType.d'
import { ConfigMode } from '@/app/admin/resource/resourceType'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Chip,
  Snippet,
  Image,
} from '@nextui-org/react'
import NextAutocomplete from '../nextAutocomplete'
import { GetMod, CreateResource, UpdateResource } from '@/api'
import { toast } from 'sonner'
import Upload from '../upload'
import Icon from '../icon'
import { BE_HOST } from '@/config/env'

// const subtypeList = [
//   {
//     label: '全局',
//     value: 'overall',
//   },
//   {
//     label: '全局',
//     value: 'overall',
//   },
//     {
//     label: '全局',
//     value: 'overall',
//   },
// ]

const ResourceModal = (props: types.ConfigProps) => {
  const [modList, setModList] = useState<Array<types.ConfigMod>>([])
  const [id, setId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [nameErrMsg, setNameErrMsg] = useState('')
  const [code, setCode] = useState('')
  const [codeErrMsg, setCodeErrMsg] = useState('')
  const [modSelect, setModSelect] = useState<string | number | null>(null)
  const [modInput, setModInput] = useState('')
  const [modErrMsg, setModErrMsg] = useState('')
  const [isEmpty, setIsEmpty] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [mode, setMode] = useState<ConfigMode>('edit')
  const [number, setNumber] = useState('')
  const [numberErrMsg, setNumberErrMsg] = useState('')
  const [generate, setGenerate] = useState('')
  const [thumbnail, setThumbnail] = useState('')

  useEffect(() => {
    if (props.isOpen) {
      setMode(props.mode)
      setName(props.resource?.name ?? '')
      setCode(props.resource?.code ?? '')
      setThumbnail(props.resource?.thumbnail ?? '')
      if (props.mode === 'edit') {
        getMod()
        setId(props.resource?.id ?? null)
        setIsCreate(!props.resource)
      } else {
        setNumber('')
      }
    } else {
      reset()
    }
  }, [props.isOpen])

  const reset = () => {
    setModList([])
    setId(null)
    setName('')
    setNameErrMsg('')
    setCode('')
    setCodeErrMsg('')
    setModSelect(null)
    setModInput('')
    setModErrMsg('')
    setIsEmpty(false)
    setIsCreate(true)
    setMode('edit')
    setNumber('')
    setNumberErrMsg('')
    setGenerate('')
    setThumbnail('')
  }

  const getMod = async () => {
    const response = await GetMod()
    const { code, data, msg } = await response.json()
    if (code !== 200) {
      toast.error(msg)
      return
    }
    let modList = []
    if (data.length === 0) {
      setIsEmpty(true)
      modList.push({ label: '默认', value: '默认' })
    } else {
      setIsEmpty(false)
      modList = data.map((mod: resourceTypes.ConfigResource) => ({
        label: mod.name,
        value: mod.id,
      }))
    }
    setModList(modList)
  }

  const onSelectionChange = (e: string) => {
    modErrMsg && setModErrMsg('')
    const number = Number(e)
    setModSelect(e === null || isNaN(number) ? e : number)
  }

  const onInputChange = (e: string) => {
    modErrMsg && setModErrMsg('')
    setModInput(e)
  }

  const onSubmit = async (callback: Function) => {
    if (!name.trim()) {
      setNameErrMsg('请输入词条名称')
      return
    }
    if (!code.trim()) {
      setCodeErrMsg('请输入词条代码')
      return
    }
    if (!modInput.trim() && !modSelect) {
      setModErrMsg('请输入所属模组')
      return
    }
    let mod = modSelect ?? modInput
    if (!modSelect) {
      mod =
        modList.find(mod => {
          return mod.label === modInput
        })?.id ?? mod
    }
    editResource({ name, code, mod, thumbnail }, callback)
  }

  const editResource = async (
    params: resourceTypes.ConfigPostParams,
    callback: Function
  ) => {
    const response = isCreate
      ? await CreateResource(params)
      : await UpdateResource({ ...params, id: id as number })
    const { code, msg } = await response.json()
    if (code !== 200) {
      toast.error(msg)
      return
    }
    toast.success(`词条${isCreate ? '创建' : '修改'}成功`)
    props.reRender()
    callback()
  }

  const changeName = (e: string) => {
    nameErrMsg && setNameErrMsg('')
    setName(e)
  }

  const changeCode = (e: string) => {
    codeErrMsg && setCodeErrMsg('')
    setCode(e)
  }

  const generateCode = (mark: 'create' | 'remove') => {
    if (!number.trim()) {
      setNumberErrMsg('请输入数量')
      return
    }
    const num = Number(number)
    if (isNaN(num)) {
      setNumberErrMsg('请输入数字')
      return
    }
    const gen = `${mark} | ${code} | ${num}`
    setGenerate(gen)
  }

  const changeNumber = (e: string) => {
    numberErrMsg && setNumberErrMsg('')
    setNumber(e)
  }

  const beforeCopy = (e: string | string[]) => {
    const arr = typeof e === 'string' ? e.split(' | ') : e
    const code =
      arr[0] === 'create'
        ? `c_give("${arr[1]}", ${arr[2]})`
        : `for i=1,${arr[2]},1 do c_findnext("${arr[1]}",30):Remove() end`
    navigator.clipboard.writeText(code)
  }

  const onFile = (file: string) => {
    setThumbnail(file)
  }

  const removeThumbnail = (e: any) => {
    setThumbnail('')
    e.stopPropagation()
  }

  const uploadSlot = () => {
    return (
      <div className={styles['upload-main']}>
        {thumbnail ? (
          <div className={styles['upload__img']}>
            <Image
              isZoomed
              width={80}
              radius="sm"
              alt="NextUI Fruit Image with Zoom"
              src={`${BE_HOST}/${thumbnail}`}
            />
            <div className={styles['upload__img-delete']}>
              <Icon
                font={''}
                size="0.875rem"
                color="#ff0061"
                onPress={removeThumbnail}
              />
            </div>
          </div>
        ) : (
          <Icon font={''} size="1.25rem" />
        )}
      </div>
    )
  }

  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {onClose => (
          <>
            {mode === 'edit' ? (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {(isCreate ? '创建' : '修改') + props.title}
                </ModalHeader>
                <ModalBody>
                  <Input
                    size="sm"
                    radius="md"
                    className={styles['input']}
                    isClearable
                    type="text"
                    variant="bordered"
                    placeholder="请输入词条名称"
                    isInvalid={!!nameErrMsg}
                    errorMessage={nameErrMsg}
                    value={name}
                    onValueChange={changeName}
                  />
                  <Input
                    size="sm"
                    radius="md"
                    className={styles['input']}
                    isClearable
                    type="text"
                    variant="bordered"
                    placeholder="请输入词条代码"
                    isInvalid={!!codeErrMsg}
                    errorMessage={codeErrMsg}
                    value={code}
                    onValueChange={changeCode}
                  />
                  <NextAutocomplete
                    placeholder="请输入所属模组"
                    defaultItems={modList}
                    errorMessage={modErrMsg}
                    defaultSelectedKey={
                      props.resource?.mod_id ?? (isEmpty ? '默认' : 1)
                    }
                    onSelectionChange={onSelectionChange}
                    onInputChange={onInputChange}
                  />
                  <Upload
                    className={styles['upload']}
                    onFile={onFile}
                    slot={uploadSlot()}
                  />
                  {/* <NextAutocomplete
                    placeholder="请选择词条分类"
                    width="200px"
                    defaultItems={subtypeList}
                    onSelectionChange={setSubtype}
                  /> */}
                </ModalBody>
                <ModalFooter>
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={onClose}
                  >
                    取消
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    onPress={() => onSubmit(onClose)}
                  >
                    {isCreate ? '创建' : '修改'}
                  </Button>
                </ModalFooter>
              </>
            ) : (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  代码生成
                </ModalHeader>
                <ModalBody>
                  <Chip color="warning" variant="dot">
                    {name + code}
                  </Chip>
                  <Input
                    size="sm"
                    radius="md"
                    className={styles['input']}
                    isClearable
                    type="text"
                    variant="bordered"
                    placeholder="请输入数量"
                    isInvalid={!!numberErrMsg}
                    errorMessage={numberErrMsg}
                    value={number}
                    onValueChange={changeNumber}
                  />
                  <div className={styles['button-group']}>
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => generateCode('create')}
                    >
                      生成
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onPress={() => generateCode('remove')}
                    >
                      删除
                    </Button>
                  </div>
                  {generate && (
                    <Snippet variant="bordered" size="sm" onCopy={beforeCopy}>
                      {generate}
                    </Snippet>
                  )}
                </ModalBody>
                <ModalFooter></ModalFooter>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ResourceModal
