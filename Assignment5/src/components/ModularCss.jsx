import Style from './ModularCss.module.css'

export const ModularCss = () => {
  return (
    <>
    <div className={Style.container}>
      <h1 id={Style.heading}>Modular Css</h1>
      <p id={Style.para}>This component is designed using Modular CSS</p>
    </div>
    </>
  )
}
