import {
  IonButton,
  IonChip,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPopover,
  IonTextarea,
} from "@ionic/react";

import { useTranslation } from "react-i18next";
import { Preferences } from "@capacitor/preferences";
import key from "../lib/storageKey.json";
import { trigger } from "../lib/Events";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from 'rehype-external-links'
import { informationCircle, save } from "ionicons/icons";

import "./DescriptionEditor.css";
import style from "./markdown-styles.module.css"

export default function DescriptionEditor({
  id,
  description,
  setDescription,
  editable,
  accent,
  needToSave,
  setNeedToSave,
}: {
  id: string;
  description: string;
  setDescription: any;
  editable: boolean;
  accent: string;
  needToSave: boolean;
  setNeedToSave: any;
}) {
  const {t} = useTranslation();
  let countdate_events_data = [];
  const edit_this_countdate_item_description = async (
    newDescription: string | undefined | null
  ) => {
    if (newDescription === undefined || newDescription === null) return;
    const { value } = await Preferences.get({ key: key.data });
    if (value) {
      countdate_events_data = JSON.parse(value);
      for (const i of countdate_events_data) {
        if (String(i.id) === String(id)) {
          i.description = newDescription;
        }
      }
      let content = JSON.stringify(countdate_events_data);
      await Preferences.set({
        key: key.data,
        value: content,
      });
      trigger("countdate_data:change");
    }
  };
  return (
    <>
      {editable ? (
        <>
          <IonItem>
            <span>
              {t("c.editor.description")}
            </span>
          </IonItem>
          <IonItem>
            <IonTextarea
              style={{fontSize: "1.2rem"}}
              aria-label="Description editor"
              placeholder={t("c.editor.description")}
              autoGrow={true}
              fill="solid"
              value={description}
              onIonChange={(e) => {
                setDescription(e.detail.value!);
                setNeedToSave(true);
              }}
            ></IonTextarea>
          </IonItem>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
            <IonButton
              id="click-trigger-description"
              color={accent}
              fill="clear"
              size="small"
            >
              {" "}
              <IonIcon icon={informationCircle}></IonIcon>{" "}
            </IonButton>
            <IonPopover trigger="click-trigger-description" triggerAction="click">
              <IonContent class="ion-padding">{t("c.editor.tips")}</IonContent>
            </IonPopover>

            <IonButton
              slot="end"
              color={accent}
              onClick={() => {
                edit_this_countdate_item_description(description);
                setNeedToSave(false);
              }}
              size="small"
              fill="clear"
            >
              <IonIcon icon={save} />
            </IonButton>
          </div>
        </>
      ) : (
        <>
          {needToSave ? (
            <IonChip style={{ marginLeft: 4, marginBottom: 16 }} color={accent}>
              <IonIcon icon={informationCircle}></IonIcon>
              <IonLabel>{t("c.editor.needToSave")}</IonLabel>
            </IonChip>
          ) : (
            <></>
          )}

          {description ? (
            <>
              <ReactMarkdown
                children={description}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[[rehypeExternalLinks, {target: "_blank"}]]}
                className={style.reactMarkDown}
              />
            </>
          ) : (
            <h5 style={{fontSize: "1.2rem"}}>
              {t("c.editor.noDescriptionData")}
            </h5>
          )}
        </>
      )}
    </>
  );
}
