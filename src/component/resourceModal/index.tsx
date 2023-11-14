import React, { useEffect, useState } from 'react'
import styles from './resourceModalStyle.module.scss'
import types from './resourceModalType.d'
import resourceTypes from '@/app/api/resources/resourceType.d'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react'
import NextAutocomplete from '../nextAutocomplete'
import { GetMod, CreateResource, UpdateResource } from '@/api'
import { toast } from 'sonner'

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

  useEffect(() => {
    props.isOpen && getMod()
    setId(props.resource?.id ?? null)
    setName(props.resource?.name ?? '')
    setCode(props.resource?.code ?? '')
    setIsCreate(!props.resource)
  }, [props.isOpen])

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
      modList = data.map((mod: resourceTypes.ConfigResource) => {
        console.log(typeof mod.id)
        return {
          label: mod.name,
          value: mod.id,
        }
      })
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
      setModErrMsg('请输入词条分类')
      return
    }
    let mod = modSelect ?? modInput
    if (!modSelect) {
      mod =
        modList.find(mod => {
          return mod.label === modInput
        })?.id ?? mod
    }
    editResource({ name, code, mod }, callback)
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

  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {props.title}
            </ModalHeader>
            <ModalBody>
              <Input
                size="sm"
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
                placeholder="请选择词条分类"
                defaultItems={modList}
                errorMessage={modErrMsg}
                defaultSelectedKey={
                  props.resource?.mod_id ?? (isEmpty ? '默认' : 1)
                }
                onSelectionChange={onSelectionChange}
                onInputChange={onInputChange}
              />
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
                创建
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ResourceModal
