import { AppDialog } from "@/shared/components/app-dialog";
import { AppIcon } from "@/shared/components/app-icon";
import { PrimaryButton } from "@/shared/components/primary-button";
import { useController, type FieldValues } from "react-hook-form";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { MONTHS, WEEKDAYS } from "./date-picker.const";
import { civilDate, sameDay } from "./date-picker.helper";
import type { FormDatePickerProps } from "./date-picker.types";
import { useDatePicker } from "./useDatePicker";

const dayLabel = new Intl.DateTimeFormat("es-PE", { dateStyle: "full" });
const draftLabel = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function FormDatePicker<TForm extends FieldValues>({
  control,
  name,
  label,
  minimumDate,
  maximumDate,
  initialDate,
}: FormDatePickerProps<TForm>) {
  const { field, fieldState } = useController({ control, name });
  const {
    open,
    view,
    setView,
    yearQuery,
    years,
    canGoBack,
    canGoForward,
    handleShowYears,
    handleYearQuery,
    handleSelectMonth,
    handleSelectYear,
    draft,
    dateLimit,
    dateStart,
    shownMonth,
    calendarCells,
    displayValue,
    handleOpenPicker,
    handleCancel,
    handleChangeMonth,
    handleSelectDay,
    handleAcceptDraft,
  } = useDatePicker({
    value: field.value,
    onChange: field.onChange,
    onBlur: field.onBlur,
    minimumDate,
    maximumDate,
    initialDate,
  });
  return (
    <View className="gap-1.5">
      <Text className="font-brand-medium text-sm text-muted">{label}</Text>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityValue={{ text: displayValue }}
        ref={(instance) => field.ref(instance)}
        className={`min-h-12 flex-row items-center justify-between gap-1 rounded-lg border bg-white px-3 ${
          fieldState.error ? "border-danger" : "border-line"
        }`}
        onPress={handleOpenPicker}
      >
        <Text
          className={
            field.value
              ? "flex-1 font-brand text-sm text-ink"
              : "flex-1 font-brand text-sm text-muted"
          }
        >
          {displayValue}
        </Text>
        <AppIcon name="chevron-down" size={16} />
      </Pressable>
      {fieldState.error?.message ? (
        <Text
          accessibilityRole="alert"
          className="font-brand text-xs text-danger"
        >
          {fieldState.error.message}
        </Text>
      ) : null}

      <AppDialog
        onClose={handleCancel}
        title={label}
        visible={open}
        scrollable={view !== "years"}
      >
        <View className="mb-4 rounded-2xl bg-canvas p-4">
          <Text className="text-center font-brand-medium text-xs text-muted">
            {label.toLocaleUpperCase("es-PE")}
          </Text>
          <Text className="mt-1 text-center font-brand-bold text-2xl text-ink">
            {draft ? draftLabel.format(draft) : ""}
          </Text>
        </View>

        {view !== "days" && (
          <Pressable
            accessibilityRole="button"
            onPress={() => setView("days")}
            className="mb-2 min-h-11 justify-center"
          >
            <Text className="font-brand-semibold text-ink">
              Volver al calendario
            </Text>
          </Pressable>
        )}

        {view === "months" &&
          MONTHS.map((month, index) => {
            const disabled =
              (shownMonth.getFullYear() === dateLimit.getFullYear() &&
                index > dateLimit.getMonth()) ||
              (shownMonth.getFullYear() === dateStart.getFullYear() &&
                index < dateStart.getMonth());
            return (
              <Pressable
                key={month}
                accessibilityRole="button"
                accessibilityState={{
                  disabled,
                  selected: index === shownMonth.getMonth(),
                }}
                disabled={disabled}
                onPress={() => handleSelectMonth(index)}
                className="min-h-11 justify-center px-3 active:bg-canvas"
              >
                <Text
                  className={
                    disabled
                      ? "capitalize text-muted-light"
                      : "capitalize text-ink"
                  }
                >
                  {month}
                </Text>
              </Pressable>
            );
          })}

        {view === "years" && (
          <>
            <TextInput
              accessibilityLabel="Buscar año"
              placeholder="Buscar año"
              keyboardType="number-pad"
              value={yearQuery}
              onChangeText={handleYearQuery}
              className="mb-2 min-h-11 rounded-lg border border-line px-3 text-ink"
            />
            <FlatList
              key={yearQuery}
              style={{ height: 176, flexGrow: 0, flexShrink: 1 }}
              data={years}
              keyExtractor={String}
              keyboardShouldPersistTaps="handled"
              initialScrollIndex={
                yearQuery
                  ? undefined
                  : dateLimit.getFullYear() - shownMonth.getFullYear()
              }
              getItemLayout={(_, index) => ({
                length: 44,
                offset: 44 * index,
                index,
              })}
              ListEmptyComponent={
                <Text className="text-muted">No hay años disponibles</Text>
              }
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: item === shownMonth.getFullYear(),
                  }}
                  onPress={() => handleSelectYear(item)}
                  style={{ height: 44 }}
                  className="justify-center px-3 active:bg-canvas"
                >
                  <Text className="font-brand-medium text-ink">
                    {String(item).padStart(4, "0")}
                  </Text>
                </Pressable>
              )}
            />
          </>
        )}

        {view === "days" && (
          <>
            <View className="mb-3 flex-row items-center justify-between">
              <Pressable
                accessibilityLabel="Mes anterior"
                accessibilityRole="button"
                className="h-11 w-11 items-center justify-center rounded-full active:bg-canvas"
                accessibilityState={{ disabled: !canGoBack }}
                disabled={!canGoBack}
                onPress={() => handleChangeMonth(-1)}
              >
                <Text className="font-brand-bold text-xl text-ink">‹</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Elegir mes"
                accessibilityValue={{ text: MONTHS[shownMonth.getMonth()] }}
                className="min-h-11 justify-center px-2"
                onPress={() => setView("months")}
              >
                <Text className="font-brand-bold text-base capitalize text-ink">
                  {MONTHS[shownMonth.getMonth()]}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Elegir año"
                accessibilityValue={{ text: String(shownMonth.getFullYear()) }}
                className="min-h-11 justify-center px-2"
                onPress={handleShowYears}
              >
                <Text className="font-brand-bold text-base text-ink">
                  {shownMonth.getFullYear()}
                </Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Mes siguiente"
                accessibilityRole="button"
                accessibilityState={{ disabled: !canGoForward }}
                className="h-11 w-11 items-center justify-center rounded-full active:bg-canvas"
                disabled={!canGoForward}
                onPress={() => handleChangeMonth(1)}
              >
                <Text className="font-brand-bold text-xl text-ink">›</Text>
              </Pressable>
            </View>

            <View accessibilityRole="grid" className="gap-1">
              <View className="flex-row">
                {WEEKDAYS.map((weekday, index) => (
                  <View
                    key={weekday + index}
                    className="h-10 flex-1 items-center justify-center"
                  >
                    <Text className="font-brand-semibold text-xs text-muted">
                      {weekday}
                    </Text>
                  </View>
                ))}
              </View>
              {Array.from(
                { length: calendarCells.length / 7 },
                (_, weekIndex) => (
                  <View
                    key={weekIndex}
                    accessibilityRole="row"
                    className="flex-row"
                  >
                    {calendarCells
                      .slice(weekIndex * 7, weekIndex * 7 + 7)
                      .map((day, dayIndex) => {
                        const date = day
                          ? civilDate(
                              shownMonth.getFullYear(),
                              shownMonth.getMonth(),
                              day,
                            )
                          : null;
                        const selected =
                          date && draft ? sameDay(date, draft) : false;
                        const disabled =
                          !date || date < dateStart || date > dateLimit;
                        return (
                          <Pressable
                            key={dayIndex}
                            accessibilityRole="gridcell"
                            accessibilityLabel={
                              date ? dayLabel.format(date) : undefined
                            }
                            accessibilityState={{ disabled, selected }}
                            className={`h-11 flex-1 items-center justify-center rounded-full ${selected ? "bg-brand" : ""}`}
                            disabled={disabled}
                            onPress={() => day && handleSelectDay(day)}
                          >
                            <Text
                              className={`font-brand-medium text-sm ${selected ? "font-brand-bold text-ink" : disabled ? "text-muted-light" : "text-ink"}`}
                            >
                              {day ?? ""}
                            </Text>
                          </Pressable>
                        );
                      })}
                  </View>
                ),
              )}
            </View>

            <View className="mt-5 gap-2">
              <PrimaryButton
                disabled={!draft || draft > dateLimit}
                onPress={handleAcceptDraft}
              >
                ACEPTAR
              </PrimaryButton>
              <Pressable
                accessibilityRole="button"
                className="min-h-12 items-center justify-center"
                onPress={handleCancel}
              >
                <Text className="font-brand-semibold text-sm text-ink">
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </AppDialog>
    </View>
  );
}
