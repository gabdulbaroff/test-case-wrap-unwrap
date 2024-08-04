import type { FC } from 'react'
import { SwitchIcon } from '../../../../assets/switch-icon.tsx'
import styles from './SwitchTransfer.module.scss'

interface ISwitchTransfer {
    className?: string
    onSwitch: () => void
}

export const SwitchTransfer: FC<ISwitchTransfer> = ({ className, onSwitch }) => {
    return (
        <div className={className}>
            <button className={styles.switch} onClick={onSwitch}>
                <SwitchIcon />
            </button>
        </div>
    )
}
