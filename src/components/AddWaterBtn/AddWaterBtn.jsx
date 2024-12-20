import css from './AddWaterBtn.module.css';
import { Icon } from '../Icon/Icon';
import { useTranslation } from 'react-i18next';

const AddWaterBtn = ({ handleClickBtn }) => {
  const { t } = useTranslation();

  return (
    <button onClick={handleClickBtn} className={css.button} type="button">
      <Icon id="icon-plus" height={24} width={24} className={css.icon} />
      <p>{t('addWaterBtn.addWater')}</p>
    </button>
  );
};

export default AddWaterBtn;