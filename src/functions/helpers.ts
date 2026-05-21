export function chooseRandomEnumValue<T extends Record<string, string|number>> (enumToChooseFrom: T): T[keyof T] {
    let values: T[keyof T][] = Object.values(enumToChooseFrom) as T[keyof T][]
    values = values.filter((value) => typeof(value) === "number")

    const randomIndex: number = Math.floor(Math.random() * values.length)
    const randomEnumValue: T[keyof T] = values[randomIndex] as T[keyof T]
    return randomEnumValue
}